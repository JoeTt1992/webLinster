<template>
  	<div class="page-list">
   		<div class="workpanel-head">
			<my-breadcrumb level1="用户管理" :level2="info"></my-breadcrumb>
		</div>	   
		<div class="workpanel-main-add" v-loading="loading">
			<div class="add-top">用户信息</div>
			<br/>
			<div class="my-form">
				<el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px">
					<div class="form-title">登录账号<span class="redstar"> *</span></div>
				  	<el-form-item label="" prop="id">
				    	<el-input v-model="userForm.id" auto-complete="off" placeholder="请输入登录账号" :disabled="ifedit" :maxlength="maxlength100"></el-input>				    	
				  	</el-form-item>
				  
				  	<div class="form-title">姓名<span class="redstar"> *</span></div>
				  	<el-form-item label="" prop="userName">
				    	<el-input v-model="userForm.userName" auto-complete="off" placeholder="请输入姓名" :maxlength="maxlength100"></el-input>
				  	</el-form-item>

				  	<div class="form-title">性别</div>
				  	<el-form-item label="" prop="gender">
    					<el-radio-group v-model="userForm.gender">
      						<el-radio label="1">男</el-radio>
      						<el-radio label="2">女</el-radio>
    					</el-radio-group>
  					</el-form-item>

				  	<div class="form-title">联系电话<span class="redstar"> *</span></div>
				  	<el-form-item label="" prop="phone">
				    	<el-input v-model="userForm.phone" auto-complete="off" placeholder="请输入联系电话" :maxlength="maxlength20"></el-input>
				  	</el-form-item>

				  	<div class="form-title">邮箱<span class="redstar"> *</span></div>
				  	<el-form-item label="" prop="email">
				    	<el-input v-model="userForm.email" auto-complete="off" placeholder="请输入邮箱" :maxlength="maxlength30"></el-input>
				  	</el-form-item>

				  	<div class="form-title">用户状态</div>
				  	<el-form-item label="" prop="state">
    					<el-radio-group v-model="userForm.state">
      						<el-radio label="Y">启用</el-radio>
      						<el-radio label="N">不启用</el-radio>
    					</el-radio-group>
  					</el-form-item>
				  	<br/>
				  	<button class="mybtn blue-btn-sm saveu-btn" @click="saveUser">保存</button>
				  	<button class="mybtn white-btn-sm canelu-btn" @click="back">取消</button>
				  	<br/><br/>
				</el-form>
			</div>
		</div>
  	</div>
</template>

<script>
import Breadcrumb from '@/components/tool/Breadcrumb'
import axios from 'axios'
import $ from 'jquery'

export default{
	data(){
		//校验电话
		var validatePhone = (rule, value, callback) => {  
			if(value!=null && value!=""){
				var phoneReg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9})|(\d{8})|(0\d{2,3}\d{7,8}))$/;
	      		if(phoneReg.test(value)){
	      			callback();
	      		}else{
	      			callback(new Error('请输入正确的联系电话'));
	      		}
			}else{
				callback(new Error('请输入联系电话'));
			}    	   		
      	};
		return{
			maxlength20: 20,
			maxlength30: 30,
			maxlength100: 100, 
			mode: '', //区分新增用户或修改用户  add/edit
			info: '', //面包屑显示文字
			ifedit: false, //是否将id输入框禁用 edit模式禁用
			userForm: {
	          	id: '',
	          	userName: '',
	          	gender: '1',
	          	phone:'',
	          	email:'',
	          	state:'N'
	        },
	        rules: {
	          	id: [
	            	{ required: true, message: '请输入登录账号', trigger: 'blur' }
	          	],
	          	userName: [
	            	{ required: true, message: '请输入姓名', trigger: 'blur' }
	          	],
	          	phone: [
	          		{ validator: validatePhone, trigger: 'blur' }
	          	],
	          	email: [
	          		{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
	          		{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
	          	]
	        },
	        loading: false
		}
	},
	mounted: function(){
		var edit = this.$route.query.edit;
		var page = this;
		if(edit=="1"){
			page.loading = true;
			this.ifedit = true;
			this.mode = 'edit';
			this.info = '信息展示 / 修改用户';
			//根据id查询用户
			axios.post('/web/user/findUser.do',{
				'userId': page.$route.query.userId
			}).then(function (response) {
			    page.loading = false;
			    if(response.data.success){
			    	var u = response.data.bean;
			    	page.userForm.id = u.id;
			    	page.userForm.userName = u.userName;
			    	page.userForm.gender = u.gender;
			    	page.userForm.phone = u.phone;
			    	page.userForm.email = u.email;
			    	page.userForm.state = u.state;			    	
			    }else{
			    	page.$message.error(response.data.message);
			    }
			}).catch(function (error) {
				console.log(error);
				page.loading = false;
				page.$message.error("系统出错了，请联系管理员");
			});
		}else{			
			page.ifedit = false;
			page.mode = 'add';
			page.info = '信息展示 / 新建用户';
		}
	},
	methods:{
		//保存用户
		saveUser: function(){
			var page = this;
			var url = "/web/user/addUser.do";
			if(this.mode=="edit"){
				url = "/web/user/editUser.do";
			}
			page.$refs['userForm'].validate((valid) => {
          		if (valid) {
          			page.loading = true;
					axios.post(url,{
						'id': $.trim(page.userForm.id),
						'userName': $.trim(page.userForm.userName),
						'gender': page.userForm.gender,
						'phone': $.trim(page.userForm.phone),
						'email': $.trim(page.userForm.email),
						'state': page.userForm.state
					}).then(function (response) {
					    page.loading = false;
					    if(response.data.success){
					    	page.$message({
		      					message: '保存成功',
		      					type: 'success'
		    				});
		    				page.$router.push({path: '/main/user/list'});
					    }else{
					    	page.$message.error(response.data.message);
					    }
					}).catch(function (error) {
						console.log(error);
						page.loading = false;
						page.$message.error("系统出错了，请联系管理员");
					});
				}
			});
		},
		//取消返回
		back: function(){
			history.go(-1);
		}
	}
}
</script>

<style scoped>
.saveu-btn{
	margin-left: 320px;
}
.canelu-btn{
	margin-left: 20px;
}
</style>