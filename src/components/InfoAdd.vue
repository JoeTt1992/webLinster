<template>
  	<div class="page-list">
   		<div class="workpanel-head">
			<my-breadcrumb :level1="info1" :level2="info2"></my-breadcrumb>
		</div>	   
		<div class="workpanel-main-add" v-loading="loading">
			<div class="add-top">网站信息</div>
			<br/>
			<div class="my-form">
				<el-form :model="webForm" :rules="rules" ref="webForm" label-width="100px" class="demo-webForm">
					<div class="form-title">网站名称<span class="redstar"> *</span></div>
				  	<el-form-item label="" prop="webName">
				    	<el-input v-model="webForm.webName" auto-complete="off" placeholder="请输入网站名称" :maxlength="maxlength100"></el-input>
				  	</el-form-item>

				  	<div class="form-title">URL<span class="redstar"> *</span>
				  		<span class="remark">（以“http://”或“https://”开头）</span>
				  	</div>
				  	<el-form-item label="" prop="webUrl">
				    	<el-input v-model="webForm.webUrl" auto-complete="off" placeholder="请输入URL" :maxlength="maxlength400"></el-input>
				  	</el-form-item>

				  	<div class="form-title">检测频率<span class="redstar"> *</span>
				  		<span class="remark">（以<span v-if="entrance=='key'">分钟</span><span v-else="entrance!='key'">天</span>为单位）</span>
				  	</div>
				  	<el-form-item label="" prop="webInterval">
				    	<el-input v-model="webForm.webInterval" auto-complete="off" placeholder="请输入检测频率（只输入数字即可）" :maxlength="maxlength11"></el-input>
				  	</el-form-item>

					<div v-show="entrance!='web'">
					  	<div class="form-title">通知方式</div>
					  	<el-form-item label="" prop="linkType">
	    					<el-radio-group v-model="webForm.linkType">
	      						<el-radio label="1">短信</el-radio>
	      						<el-radio label="2">邮件</el-radio>
	    					</el-radio-group>
	  					</el-form-item>

					  	<div class="form-title">通知人<span class="redstar"> *</span></div>
					  	<el-form-item label="" prop="receiver">
	    					<el-select v-model="webForm.receiver" placeholder="请选择通知人">
	      						<el-option v-for="rec in recs" :key="rec.id" :label="rec.userName" :value="rec.id">
	      							<span style="float: left">{{ rec.userName }}</span>
	    						</el-option>
	    					</el-select>
	  					</el-form-item>
  					</div>

  					<div class="form-title">网站状态</div>
				  	<el-form-item label="" prop="state">
    					<el-radio-group v-model="webForm.state">
      						<el-radio label="Y">启用</el-radio>
      						<el-radio label="N">不启用</el-radio>
    					</el-radio-group>
  					</el-form-item>
  					<br/>
				  	<button class="mybtn blue-btn-sm saveu-btn" @click="saveInfo">保存</button>
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
		//url校验
		var validateUrl = (rule, value, callback) => {
        	if (value === '') {
          		callback(new Error('请输入URL'));
        	} else {
        		var strRegex = '^((https|http|ftp|rtsp|mms)?://)'
					+ '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@ 
					+ '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184 
					+ '|' // 允许IP和DOMAIN（域名） 
					+ '([0-9a-z_!~*\'()-]+.)*' // 域名- www. 
					+ '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名 
					+ '[a-z]{2,6})' // first level domain- .com or .museum 
					+ '(:[0-9]{1,4})?' // 端口- :80 
					+ '((/?)|' // a slash isn't required if there is no file name 
					+ '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$'; 
				var urlReg=new RegExp(strRegex); 
          		if(urlReg.test(value)){
          			callback();
          		}else{
          			callback(new Error('请输入正确的URL'));
          		}
        	}
      	};
      	//通知人校验
      	var validateReceiver = (rule, value, callback) => {
        	if (value === '' && this.entrance!='web') {
          		callback(new Error('请选择通知人'));
        	} else {
        		callback();
        	}
      	};
      	var validateNum = (rule, value, callback) => {
        	if (value === '') {
          		callback(new Error('请输入检测频率'));
        	} else {
        		var numReg = /^\d+$/;
          		if(numReg.test(value)){
          			if(value==0 || value=="0"){
          				callback(new Error('检测频率不能为0'));
          			}else{
          				callback();
          			}        			
          		}else{
          			callback(new Error('检测频率应为数字'));
          		}
        	}
      	};
		return{
			maxlength100: 100,
			maxlength400: 400,
			maxlength11: 11,
			entrance: '',  //区分关键栏目检查key、网站检查web、关键栏目更新检查keyupdate
			mode: '',   //区分新增网站或修改网站  add/edit
			info1: '',  //第一级面包屑
			info2: '',  //第二级面包屑
			recs: [],  //通知人下拉选
			type: '',  //关键栏目检查1、网站检查2、关键栏目更新检查3
			webForm: {				
	          	webName: '',
	          	webUrl: '',
	          	webInterval: '',
	          	linkType: '1',
	          	receiver: '',
	          	state: 'N'	          	
	        },
	        rules: {
	          	webName: [
	            	{ required: true, message: '请输入网站名称', trigger: 'blur' }
	          	],
	          	webUrl: [
	            	{ validator: validateUrl, trigger: 'blur' }
	          	],
	          	webInterval: [
	            	{ validator: validateNum, trigger: 'blur' }
	          	],
	          	receiver: [
	            	{ validator: validateReceiver, trigger: 'change' }
	          	],
	        },
	        loading: true
		}
	},
	mounted: function(){
		this.entrance = this.$route.query.entrance;
		if(this.entrance=="key"){
			this.info1 = "关键栏目检查";
			this.type = "1";
		}else if(this.entrance=="web"){
			this.info1 = "网站检测";
			this.type = "2";
		}else{
			this.info1 = "关键栏目更新检测";
			this.type = "3";
		}

		var page = this;
		//获取通知人下拉列表
		axios.post('/web/user/findAll.do').then(function (response) {
		    if(response.data.success){		    	
		    	page.recs = response.data.bean;	    	

		    	//成功加载通知人列表后判断是新增还是修改操作，修改时回显通知人，应保证通知人列表加载完毕
		    	var edit = page.$route.query.edit;		
				if(edit=="1"){
					page.mode = 'edit';
					page.info2 = '信息录入 / 修改网站';
					//根据id查询用户
					axios.post('/web/web/findWeball.do',{
						'webId': page.$route.query.webId				
					}).then(function (response) {
					    page.loading = false;
					    if(response.data.success){
					    	var w = response.data.bean;
					    	page.webForm.webName = w.webName;
					    	page.webForm.webUrl = w.webUrl;
					    	page.webForm.webInterval = w.webInterval;
					    	page.webForm.linkType = w.linkType;
					    	page.webForm.receiver = w.userId;
					    	page.webForm.state = w.state;					    	
					    }else{
					    	page.$message.error(response.data.message);
					    }
					}).catch(function (error) {
						console.log(error);
						page.loading = false;
						page.$message.error("系统出错了，请联系管理员");
					});
				}else{
					page.loading = false;
					page.mode = 'add';
					page.info2 = '信息录入 / 新增网站';
				}
		    }else{
		    	page.loading = false;
		    	console.log(response.data.message);
		    }
		}).catch(function (error) {
			console.log(error);
			page.loading = false;
			page.$message.error("系统出错了，请联系管理员");
		});
	},
	methods:{
		//保存网站
		saveInfo: function(){
			var page = this;
			var url = "/web/web/addWeb.do";
			if(this.mode=="edit"){
				url = "/web/web/editWeb.do";
			}

			page.$refs['webForm'].validate((valid) => {
          		if (valid) {
          			page.loading = true;
					axios.post(url,{
						'id': page.$route.query.webId,
						'webName': $.trim(page.webForm.webName),
						'webUrl': $.trim(page.webForm.webUrl),
						'webInterval': $.trim(page.webForm.webInterval),
						'type': this.type,
						'linkType': page.webForm.linkType,
						'state': page.webForm.state,
						'userId': page.webForm.receiver
					}).then(function (response) {
					    page.loading = false;
					    if(response.data.success){
					    	page.$message({
		      					message: '保存成功',
		      					type: 'success'
		    				});
		    				page.$router.push({path: '/main/'+page.entrance+'/result',query:{entrance: page.entrance}});
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
.el-select,.el-input__inner{
	width: 620px !important;
}
.remark{
	color: #999;
}
</style>