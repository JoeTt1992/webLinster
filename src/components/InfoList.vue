<template>
	<div class="page-list">
		<div class="workpanel-head">
			<my-breadcrumb :level1="info" level2="信息展示"></my-breadcrumb>
			<button class="mybtn green-btn-lg page-btn" id="export" @click="exporttab">
				<img src="../assets/images/export.png"/>&nbsp;全部导出
			</button>
			<my-searchbox ref="searchparam" @search="search" placeholder="请输入网站名称"></my-searchbox>
			<div class="timetool">
				检查时间：
				<el-date-picker :editable="editable" v-show="entrance!='key'" v-model="date" type="daterange" range-separator="至"
      				:start-placeholder="yesterday" :end-placeholder="today" size="small" value-format="yyyy-MM-dd">
    			</el-date-picker>
				
				<el-date-picker :editable="editable" v-show="entrance=='key'" v-model="timer" type="date" value-format="yyyy-MM-dd" :placeholder="today"></el-date-picker>
			</div>
		</div>	   
		<div class="workpanel-main">
			<div id="listDiv">
				<el-table v-loading="loading" :data="list" :height="tHeight" style="width: 100%;">
					<el-table-column label="#" width="80" align="center" type="index"></el-table-column>
		    		<el-table-column prop="name" label="网站名称" width="280"></el-table-column>
		    		<el-table-column prop="url" label="首页URL" width="280"></el-table-column>
		    		<el-table-column prop="pinlv" label="检测频率" align="center" :formatter="formatInterval"></el-table-column>

		    		<el-table-column v-if="type=='2'" prop="totalNum" label="扫描URL总数" align="center"></el-table-column>
		    		<el-table-column v-else-if="type=='3'" prop="totalNum" label="URL总数" align="center"></el-table-column>
		    		<el-table-column v-else prop="totalNum" label="连接总次数" align="center"></el-table-column>

		    		<el-table-column v-if="type=='2'" prop="num" label="可用URL总数" align="center"></el-table-column>
					<el-table-column v-else-if="type=='1'" prop="num" label="成功次数" align="center"></el-table-column>

		    		<el-table-column v-if="type=='2'" prop="errorNum" label="不可用URL总数" align="center"></el-table-column>
		    		<el-table-column v-else-if="type=='3'" prop="errorNum" label="更新数量" align="center"></el-table-column>
		    		<el-table-column v-else prop="errorNum" label="失败次数" align="center"></el-table-column>		    		
		  		</el-table>
	  		</div>
		</div>
		<div class="workpanel-foot">
			<el-pagination 
      			@current-change="handleCurrentChange"
      			:current-page.sync="currentPage"
			    :page-size="pageSize"
			    layout="prev, pager, next, total"
			    :total="totalCount">
    		</el-pagination>
		</div>

		<form action="/web/web/downExcel.do" id="exportForm" method="post">
			<input type="hidden" name="type" id="type"/>
			<input type="hidden" name="timer" id="timer"/>
			<input type="hidden" name="startTime" id="startTime"/>
			<input type="hidden" name="endTime" id="endTime"/>
			<input type="hidden" name="webName" id="webName"/>
		</form>
	</div>
</template>

<script>
import Breadcrumb from '@/components/tool/Breadcrumb'
import Searchbox from '@/components/tool/Searchbox'
import axios from 'axios'
import $ from 'jquery'

export default{
	data(){
		return{
			editable: false,
			date: "",
			entrance: "",    //区分关键栏目检查key、网站检查web、关键栏目更新检查keyupdate
			info: "",       //面包屑
			type: "",  //关键栏目检查1、网站检查2、关键栏目更新检查3
			yesterday: "",
			today: "",
			timer: "",  //关键栏目检查只显示一个时间框
			starttime: "",
			endtime: "",
			list: [],
			currentPage: 1,
			pageSize: 10,
			totalCount: 0,
			axiosParam:{
				'type': "",
				'timer': "",
				'startTime': "",
				'endTime': "",
				'webName': "",
				'currentPage': 1
			},
			loading: true,
			tHeight: 0 //表格高度属性 固定表头用
		}
	},
	mounted:function(){
		//挂载元素后为表格外div定高，以确定表格高度
		$("#listDiv").height($(".workpanel-main").height());
		this.tHeight = $(".workpanel-main").height();

		//初始化时间
		var ydate = new Date();
		ydate.setTime(ydate.getTime()-24*60*60*1000);
		this.yesterday = ydate.getFullYear()+"-" + (ydate.getMonth()+1) + "-" + ydate.getDate();
		var date = new Date();
		date.setTime(date.getTime());
		this.today = date.getFullYear()+"-" + (date.getMonth()+1) + "-" + date.getDate();

		this.resetParams();
		this.getList(this.axiosParam);		
	},
	//解决路由跳转到同一页面不刷新问题
  	watch: {
    	'$route' (to, from) {
     		this.watchDifferentEntrance();
   		}
  	},
	methods:{
		watchDifferentEntrance() {
			this.resetParams();
			this.getList(this.axiosParam);
    	},
    	//重置页面参数等
    	resetParams: function(){
    		//清空时间控件
    		this.timer = "";
			this.starttime = "";
			this.endtime = "";
			this.date = "";

			this.$refs.searchparam.param = "";

    		this.entrance = this.$route.query.entrance; 
			//变更面包屑内容
			if(this.entrance=="key"){
				this.info = "关键栏目检查";
				this.type = "1";
			}else if(this.entrance=="web"){
				this.info = "网站检测";
				this.type = "2";
			}else{
				this.info = "关键栏目更新检测";
				this.type = "3";
			}

			if(this.type=="1"){
				this.axiosParam.startTime = "";
				this.axiosParam.endTime = "";
				this.axiosParam.timer = this.today;
			}else{
				this.axiosParam.startTime = this.yesterday;
				this.axiosParam.endTime = this.today;
				this.axiosParam.timer = "";
			}

			this.axiosParam.type = this.type;			
    	},
    	//获取列表
    	getList: function(param){
    		var page = this; 
    		page.loading = true;			
			axios.post('/web/web/findWebResult.do',param).then(function (response) {
				page.loading = false;
			    if(response.data.success){
			    	page.list = response.data.bean.data;
			    	page.totalCount = response.data.bean.rowCount;
			    }else{
			    	page.$message.error(response.data.message);
			    }
			}).catch(function (error) {
				console.log(error);
				page.loading = false;
				page.$message.error("系统出错了，请联系管理员");
			});
    	},
    	//查询按钮
		search: function(){
			this.currentPage = 1;

			if(this.date && this.date!=null && this.date!=""){
				this.starttime = this.date[0];
				this.endtime = this.date[1];
			}else{
				this.starttime = this.yesterday;
				this.endtime = this.today;
			}
			if(this.type=="1"){
				this.starttime = "";
				this.endtime = "";
			}else{
				this.timer = "";
			}
			

			this.axiosParam = {
				'type': this.type,
				'timer': this.timer,
				'startTime': this.starttime,
				'endTime': this.endtime,
				'webName': $.trim(this.$refs.searchparam.param),
				'currentPage': this.currentPage
			};
			this.getList(this.axiosParam);
		},
		//导出
		exporttab: function(){
			$("#type").val(this.axiosParam.type);
			$("#timer").val(this.axiosParam.timer);
			$("#startTime").val(this.axiosParam.startTime);
			$("#endTime").val(this.axiosParam.endTime);
			$("#webName").val(this.axiosParam.webName);
			$("#exportForm").submit();
		},
		//分页点击页码方法
		handleCurrentChange(val) {
       		this.axiosParam.currentPage = val;
       		this.getList(this.axiosParam);
      	},
      	//检测频率显示格式化
      	formatInterval: function(row, column){
      		if(this.entrance=="key"){
      			return row.pinlv +"分钟一次";
      		}else{
      			return row.pinlv +"天一次";
      		}
      	}
	}
}
</script>

