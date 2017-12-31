<template>
	<div class="page-list">
		<div class="workpanel-head">
			<my-breadcrumb level1="用户管理" level2="信息展示"></my-breadcrumb>
			<button class="mybtn green-btn-lg page-btn" id="toAdd" @click="toAdd">
				<img src="../../assets/images/add.png"/>&nbsp;新建用户
			</button>
			<my-searchbox ref="searchparam" @search="search" placeholder="请输入用户姓名"></my-searchbox>
		</div>	   
		<div class="workpanel-main">
			<div id="userListDiv">
				<el-table v-loading="loading" :data="userlist" :height="tHeight" style="width: 100%;">
					<el-table-column label="#" width="80" align="center" type="index"></el-table-column>
		    		<el-table-column prop="id" label="登录账号"></el-table-column>
		    		<el-table-column prop="userName" label="姓名"></el-table-column>
		    		<el-table-column prop="gender" label="性别" align="center" :formatter="formatGender"></el-table-column>
		    		<el-table-column prop="phone" label="联系电话"></el-table-column>
		    		<el-table-column prop="email" label="邮箱"></el-table-column>
		    		<el-table-column prop="state" label="用户状态" align="center" :formatter="formatState"></el-table-column>
		    		<el-table-column label="操作" align="center">
		    			<template slot-scope="scope">
	        				<el-button @click="toEdit(scope.row)" type="text" size="small">修改信息</el-button>
	        				<el-button @click="resetPwd(scope.row)" type="text" size="small">重置密码</el-button>
	        				<el-button @click="changeState(scope.row)" type="text" size="small"><span v-if="scope.row.state=='Y'">作废</span><span v-else="scope.row.state=='N'">启用</span></el-button>
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
			searchName: "",
			userlist: [],
			currentPage: 1,
			pageSize: 10,
			totalCount: 0,
			axiosParam:{
				'userName': '',
				'currentPage': 1
			},
			loading: true,
			tHeight: 0 //表格高度属性 固定表头用
		}
	},
	mounted:function(){
		//挂载元素后为表格外div定高，以确定表格高度
		$("#userListDiv").height($(".workpanel-main").height());
		this.tHeight = $(".workpanel-main").height();

		//挂载元素后获取列表数据
		this.getList(this.axiosParam);		
	},	
	methods:{
		//获取列表数据公共方法
		getList: function(param){
			var page = this; 
			page.loading = true;			
			axios.post('/web/user/index.do',param).then(function (response) {
				page.loading = false;
			    if(response.data.success){
			    	page.userlist = response.data.bean.data;
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
				'userName': $.trim(this.$refs.searchparam.param),
				'currentPage': this.currentPage
			};
			this.getList(this.axiosParam);
		},
		//到新增用户页
		toAdd: function(){
			this.$router.push({ path: '/main/user/add' });
		},
		//分页点击页码方法
		handleCurrentChange(val) {
			this.axiosParam.currentPage = val;
       		this.getList(this.axiosParam);
      	},
      	//改变性别显示方式
      	formatGender: function(row, column){
      		if(row.gender=="1"){
      			return "男";
      		}else if(row.gender=="2"){
      			return "女";
      		}
      	},
      	//改变用户状态显示方式
      	formatState: function(row, column){
      		if(row.state=="Y"){
      			return "有效";
      		}else if(row.state=="N"){
      			return "无效";
      		}
      	},
      	//到编辑用户页
      	toEdit: function(user){
      		this.$router.push({ path: '/main/user/add' ,query: {edit:'1',userId:user.id}});
      	},
      	//重置密码
      	resetPwd: function(user){
      		var page = this;
      		this.$confirm('是否将用户 '+user.userName+' 的密码重置为初始密码\"123456\"？', '提示', {
          		confirmButtonText: '确定',
          		cancelButtonText: '取消',
          		type: 'warning'
        	}).then(() => {
          		axios.post('/web/user/changePass.do',{
    				'userId': user.id
  				}).then(function (response) {
				    page.loading = false;
				    if(response.data.success){
				    	page.$message({
          					message: '重置成功',
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
      	//启用/作废用户
      	changeState: function(user){
      		var opera = "";
      		var stat = "";
      		if(user.state=="Y"){
      			opera = "作废";
      			stat = "N";
      		}else if(user.state=="N"){
      			opera = "启用";
      			stat = "Y";
      		}
      		var page = this;
      		this.$confirm('是否确认'+opera+'用户 '+user.userName+'？', '提示', {
          		confirmButtonText: '确定',
          		cancelButtonText: '取消',
          		type: 'warning'
        	}).then(() => {
        		page.loading = true;
          		axios.post('/web/user/editUser.do',{
					'id': user.id,
					'state': stat
				}).then(function (response) {
				    page.loading = false;
				    user.state = stat;
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
      	}	
	}
}
</script>

