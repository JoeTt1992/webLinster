<template>
  	<div class="page-list">
   		<div class="workpanel-head">
			<my-breadcrumb level1="用户管理" level2="修改密码"></my-breadcrumb>
		</div>	   
		<div class="workpanel-main-add" v-loading="loading">
			<br/><br/>
			<div class="my-form">
				<el-form :model="pwdForm" :rules="rules" ref="pwdForm" label-width="100px">
					<div class="form-title">旧密码</div>
				  	<el-form-item label="" prop="oldpwd">
				    	<el-input type="password" v-model="pwdForm.oldpwd" auto-complete="off" :maxlength="maxlength100" placeholder="请输入旧密码"></el-input>
				  	</el-form-item>
				  
				  	<div class="form-title">新密码</div>
				  	<el-form-item label="" prop="newpwd">
				    	<el-input type="password" v-model="pwdForm.newpwd" auto-complete="off" placeholder="请输入旧密码" :maxlength="maxlength100"></el-input>
				  	</el-form-item>

				  	<div class="form-title">确认新密码</div>
				  	<el-form-item label="" prop="repwd">
				    	<el-input type="password" v-model="pwdForm.repwd" auto-complete="off" placeholder="请再次输入新密码" :maxlength="maxlength100"></el-input>
				  	</el-form-item>
				  	<br/>
				  	<button class="mybtn blue-btn-sm pwd-btn" @click="savePwd">确认修改</button>
				</el-form>
			</div>
		</div>
  	</div>
</template>

<script>
import Breadcrumb from '@/components/tool/Breadcrumb'
import axios from 'axios'

export default{
	data(){
      	var validateNewPass = (rule, value, callback) => {
        	if (value === '') {
          		callback(new Error('请再次输入新密码'));
        	} else if (value !== this.pwdForm.newpwd) {
          		callback(new Error('两次输入密码不一致!'));
        	} else {
          		callback();
        	}
      	};
		return{
			maxlength100: 100,
			pwdForm: {
	          	oldpwd: '',
	          	newpwd: '',
	          	repwd: ''
	        },
	        rules: { //element自带表单验证
	          	oldpwd: [
	            	{ required: true, message: '请输入旧密码', trigger: 'blur' },
	            	{ min: 6, message: '密码最小长度为6位', trigger: 'blur' }
	          	],
	          	newpwd: [
	            	{ required: true, message: '请输入新密码', trigger: 'blur' },
	            	{ min: 6, message: '密码最小长度为6位', trigger: 'blur' }
	          	],
	          	repwd: [
	            	{ validator: validateNewPass, trigger: 'blur' },
	            	{ min: 6, message: '密码最小长度为6位', trigger: 'blur' }
	          	]
	        },
	        loading: false
		}
	},
	methods:{
		//保存修改的密码
		savePwd: function(){
			var page = this;
			page.$refs['pwdForm'].validate((valid) => {
          		if (valid) {
          			page.loading = true;
            		axios.post('/web/user/changePass.do',{
	    				'userId': sessionStorage.getItem('loginUser'),
	    				'oldPass': page.pwdForm.oldpwd,
	    				'newPass': page.pwdForm.repwd
	  				}).then(function (response) {
					    page.loading = false;
					    if(response.data.success){					    	
					    	page.$alert('您已成功修改密码，请重新登录', '提示', {
				          		confirmButtonText: '去登录',
				          		callback: action => {
				          			sessionStorage.setItem('loginUser','');
				    				sessionStorage.setItem('userName','');
				            		page.$router.push('/');
				          		}
				        	});
					    }else{
					    	page.$message.error(response.data.message);
					    }
	 				}).catch(function (error) {
	    				console.log(error);
	    				page.loading = false;
	    				page.$message.error("系统出错了，请联系管理员");
					});
          		} else {
            		console.log('error submit!!');
            		return false;
          		}
        	});
		}
	}
}
</script>

<style scoped>
.mybtn{
	margin-left: 350px;
}
</style>