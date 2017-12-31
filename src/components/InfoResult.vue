<template>
	<div class="page-list">
		<div class="workpanel-head">
			<my-breadcrumb :level1="info" level2="信息录入"></my-breadcrumb>
			<button class="mybtn green-btn-lg page-btn" id="addweb" @click="addweb">
				<img src="../assets/images/add.png"/>&nbsp;新增网站
			</button>

			<my-searchbox ref="searchparam" @search="search" placeholder="请输入网站名称"></my-searchbox>			
		</div>	   
		<div class="workpanel-main">
			<div id="resultDiv">
				<el-table v-loading="loading" :data="result" :height="tHeight" style="width: 100%;">
					<el-table-column label="#" width="80" align="center" type="index"></el-table-column>
		    		<el-table-column prop="WEB_NAME" label="网站名称" width="280"></el-table-column>
		    		<el-table-column prop="WEB_URL" label="首页URL" width="280"></el-table-column>
		    		<el-table-column prop="WEB_INTERVAL" label="检测频率" align="center" :formatter="formatInterval"></el-table-column>
		    		<el-table-column prop="LINK_TYPE" label="通知方式" align="center" :formatter="formatLinkType"></el-table-column>
		    		<el-table-column prop="USER_ID" label="通知人" align="center"></el-table-column>
		    		<el-table-column prop="STATE" label="状态" align="center" :formatter="formatState"></el-table-column>
		    		<el-table-column label="操作" align="center">
		    			<template slot-scope="scope">
	        				<el-button @click="toEdit(scope.row)" type="text" size="small">修改</el-button>
	        				<el-button @click="changeState(scope.row)" type="text" size="small"><span v-if="scope.row.STATE=='Y'">作废</span><span v-else="scope.row.STATE=='N'">启用</span></el-button>
	      				</template>
		    		</el-table-column>
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

export default{
	data(){
		return{
			entrance: "",    //区分关键栏目检查key、网站检查web、关键栏目更新检查keyupdate
			info: "",       //面包屑
			type: "",
			result: [],
			currentPage: 1,
			pageSize: 10,
			totalCount: 0,
			axiosParam:{
				'type': '',
				'webName': '',
				'currentPage': 1
			},
			loading: true,
			tHeight: 0 //表格高度属性 固定表头用
		}
	},
	mounted: function(){
		//挂载元素后为表格外div定高，以确定表格高度
		$("#resultDiv").height($(".workpanel-main").height());
		this.tHeight = $(".workpanel-main").height();

		this.resetParams();
		this.getList(this.axiosParam);				
	},
	//解决路由跳转到同一页面不刷新问题
  	watch: {
    	'$route' (to, from) {
     		this.watchDifferentEntrance()
   		}
  	},
	methods:{
		watchDifferentEntrance() {
			this.resetParams();
			this.getList(this.axiosParam);	
    	},
    	//重置页面参数等
    	resetParams: function(){
    		this.loading = true;
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
			this.axiosParam.type = this.type;
    	},
    	//获取列表
    	getList: function(param){
    		var page = this;
    		page.loading = true;			 
			axios.post('/web/web/findWeb.do',param).then(function (response) {
				page.loading = false;
			    if(response.data.success){
			    	page.result = response.data.bean.data;	
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
			this.axiosParam = {
				'type': this.type,
				'webName': $.trim(this.$refs.searchparam.param),
				'currentPage': this.currentPage
			};
			this.getList(this.axiosParam);
		},
		addweb: function(){
			this.$router.push({ path: '/main/'+this.entrance+'/add', query: { entrance: this.entrance }});
		},
		//分页点击页码方法
		handleCurrentChange(val) {
       		this.axiosParam.currentPage = val;
       		this.getList(this.axiosParam);
      	},
      	//到编辑页
      	toEdit: function(web){
      		this.$router.push({ path: '/main/'+this.entrance+'/add' ,query: { entrance: this.entrance,webId:web.ID,edit:'1'}});
      	}, 
      	//启用/作废网站
      	changeState: function(web){
      		var opera = "";
      		var stat = "";
      		if(web.STATE=="Y"){
      			opera = "作废";
      			stat = "N";
      		}else if(web.STATE=="N"){
      			opera = "启用";
      			stat = "Y";
      		}
      		var page = this;
      		this.$confirm('是否确认'+opera+'网站 '+web.WEB_NAME+'？', '提示', {
          		confirmButtonText: '确定',
          		cancelButtonText: '取消',
          		type: 'warning'
        	}).then(() => {
        		page.loading = true;
          		axios.post('/web/web/editWebStatus.do',{
					'id': web.ID,
					'state': stat,
					'type': page.type
				}).then(function (response) {
				    page.loading = false;
				    web.STATE = stat;
				    if(response.data.success){
				    	page.$message({
	      					message: opera+'成功',
	      					type: 'success'
	    				});
				    }else{
				    	page.$message.error(response.data.message);
				    }
				}).catch(function (error) {
					console.log(error);
					page.loading = false;
					page.$message.error("系统出错了，请联系管理员");
				});
        	}).catch(() => {});
      	},
      	//检测频率显示格式化
      	formatInterval: function(row, column){
      		if(this.entrance=="key"){
      			return row.WEB_INTERVAL +"分钟一次";
      		}else{
      			return row.WEB_INTERVAL +"天一次";
      		}
      	},
      	//通知方式显示格式化
      	formatLinkType: function(row, column){
      		if(row.LINK_TYPE=="1"){
      			return "短信";
      		}else{
      			return "邮件";
      		}
      	},
      	//状态显示格式化
      	formatState: function(row, column){
      		if(row.STATE=="Y"){
      			return "启用";
      		}else{
      			return "作废";
      		}
      	}
	}
}
</script>

