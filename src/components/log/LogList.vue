<template>
	<div class="page-list">
		<div class="workpanel-head">
			<my-breadcrumb level1="日志查询" level2="信息展示"></my-breadcrumb>
			<my-searchbox ref="searchparam" @search="search" placeholder="请输入网站名称"></my-searchbox>
			<el-select class="type-select" v-model="type" placeholder="请选择日志类型" size="15">
				<el-option v-for="t in types" :key="t.value" :label="t.label" :value="t.value">
					<span style="float: left">{{ t.label }}</span>
				</el-option>
			</el-select>
			<div class="timetool">
				执行时间：
				<el-date-picker :editable="editable" v-model="date" type="daterange" range-separator="至"
      				:start-placeholder="yesterday" :end-placeholder="today" size="small" value-format="yyyy-MM-dd">
    			</el-date-picker>
			</div>

		</div>	   
		
		<div class="workpanel-main">
			<div id="listDiv">
				<el-table v-loading="loading" :data="list" :height="tHeight" style="width: 100%;">
					<el-table-column label="#" width="80" align="center" type="index"></el-table-column>
		    		<el-table-column prop="webName" label="网站名称" width="280"></el-table-column>
		    		<el-table-column prop="webUrl" label="首页URL" width="280"></el-table-column>
		    		<el-table-column prop="startTime" label="执行时间" align="center" :formatter="formatDate"></el-table-column>
		    		<el-table-column prop="STATUS" label="执行状态" align="center" :formatter="formatStatus"></el-table-column>
		    		<el-table-column prop="totalNum" label="处理数据总数" align="center"></el-table-column>
		    		<el-table-column v-if="type!='3'" prop="errorNum" label="出错数据数量" align="center"></el-table-column>
		    		<el-table-column v-else prop="errorNum" label="更新数据数量" align="center"></el-table-column>
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
	</div> 
</template>

<script>
import Breadcrumb from '@/components/tool/Breadcrumb'
import Searchbox from '@/components/tool/Searchbox'
import axios from 'axios'
import $ from 'jquery'
import moment from 'moment'

export default{
	data() {
		return{
			editable: false,
			type: '',
			date: '',
			yesterday: "",
			today: "",
			starttime: '',
			endtime: '',
			list: [],
			types: [{
	          		value: '1',
	          		label: '关键栏目检查'
        		}, {
          			value: '2',
          			label: '网站检测'
        		}, {
          			value: '3',
          			label: '关键栏目更新检测'
        		}],
        	currentPage: 1,
			pageSize: 10,
			totalCount: 0,
			axiosParam:{
				'type': '1',
				'startTime': '',
				'endTime': '',
				'webName': '',
				'currentPage': 1				
			},
			loading: true,
			tHeight: 0  //表格高度属性 固定表头用
		}
	},
	mounted: function(){
		//挂载元素后为表格外div定高，以确定表格高度
		$("#listDiv").height($(".workpanel-main").height());
		this.tHeight = $(".workpanel-main").height();

		this.type = '1';//默认显示关键栏目检查的内容

		//初始化时间
		var ydate = new Date();
		ydate.setTime(ydate.getTime()-24*60*60*1000);
		this.yesterday = ydate.getFullYear()+"-" + (ydate.getMonth()+1) + "-" + ydate.getDate();
		var date = new Date();
		date.setTime(date.getTime());
		this.today = date.getFullYear()+"-" + (date.getMonth()+1) + "-" + date.getDate();
		this.axiosParam.startTime = this.yesterday;
		this.axiosParam.endTime = this.today;

		this.getList(this.axiosParam);
	},
	methods: {
		//分页点击页码方法
		handleCurrentChange(val) {
       		this.axiosParam.currentPage = val; 
       		this.getList(this.axiosParam);
      	},
      	//获取列表
    	getList: function(param){
    		var page = this; 
    		page.loading = true;
			axios.post('/web/task/findTaskHistory.do',param).then(function (response) {
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
			this.axiosParam = {
				'type': this.type,
				'startTime': this.starttime,
				'endTime': this.endtime,
				'webName': $.trim(this.$refs.searchparam.param),
				'currentPage': this.currentPage
			};
			this.getList(this.axiosParam);
		},
		//执行状态格式化
		formatStatus: function(row, column){
			if(row.STATUS=="0" || row.STATUS==0){
      			return "未执行";
      		}else if(row.STATUS=="1" || row.STATUS==1){
      			return "执行中";
      		}else if(row.STATUS=="2" || row.STATUS==2){
      			return "执行成功";
      		}else if(row.STATUS=="3" || row.STATUS==3){
      			return "执行失败";
      		}
		},
		//时间格式化  
        formatDate:function(row, column) {  
        	if(row.startTime && row.startTime!=null && row.startTime!=""){
        		return moment(row.startTime).format("YYYY-MM-DD HH:mm:ss");  
        	}else{
        		return "";
        	}        	
        }  
	}
}
</script>

<style scoped>
.type-select{
	float: right;
	margin-right: 30px;
}
</style>