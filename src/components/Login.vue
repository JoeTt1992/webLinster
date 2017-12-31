<template>
  <div class="login">
  	<div id="loginDiv">
  		<div id="loginTitle">天津国税网站监控</div>
  		<form role="form" id="loginForm">
  			<div class="form-group"> 
		 		<input class="myinput" type="text" v-model="name" placeholder="请输入用户名" maxlength="100"/>
		    </div>
		    <div class="form-group">
	    		<input class="myinput" type="password" v-model="pwd" placeholder="请输入密码" maxlength="100"/>
	    	</div>
	    	<button class="mybtn blue-btn-lg login-btn" @click="login">登录</button>
	    </form>
    </div>
    <div class="copyright">版权所有：©2017 天津国家税务局&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;技术支持：神州浩天科技有限公司</div>
  </div>
</template>

<script>
	import axios from 'axios'

    export default {
        data() {
            return {
                name:'',
                pwd:'',
                error:''
            }
        },
        created:function(){
        	var NV = {};  
			var UA = navigator.userAgent.toLowerCase();  
			try{  
			    NV.name=!-[1,]?'ie':  
			    (UA.indexOf("firefox")>0)?'firefox':  
			    (UA.indexOf("chrome")>0)?'chrome':  
			    window.opera?'opera':  
			    window.openDatabase?'safari':  
			    'unkonw';  
			}catch(e){};  
			try{  
			    NV.version=(NV.name=='ie')?UA.match(/msie ([\d.]+)/)[1]:  
			    (NV.name=='firefox')?UA.match(/firefox\/([\d.]+)/)[1]:  
			    (NV.name=='chrome')?UA.match(/chrome\/([\d.]+)/)[1]:  
			    (NV.name=='opera')?UA.match(/opera.([\d.]+)/)[1]:  
			    (NV.name=='safari')?UA.match(/version\/([\d.]+)/)[1]:  
			    '0';  
			}catch(e){};  
			try{  
			    NV.shell=(UA.indexOf('360ee')>-1)?'360极速浏览器':  
			    (UA.indexOf('360se')>-1)?'360安全浏览器':  
			    (UA.indexOf('se')>-1)?'搜狗浏览器':  
			    (UA.indexOf('aoyou')>-1)?'遨游浏览器':  
			    (UA.indexOf('theworld')>-1)?'世界之窗浏览器':  
			    (UA.indexOf('worldchrome')>-1)?'世界之窗极速浏览器':  
			    (UA.indexOf('greenbrowser')>-1)?'绿色浏览器':  
			    (UA.indexOf('qqbrowser')>-1)?'QQ浏览器':  
			    (UA.indexOf('baidu')>-1)?'百度浏览器':  
			    '未知或无壳';  
			}catch(e){}  			

			if(NV.name!="firefox"){
				alert("为保证系统的正常使用，推荐您使用火狐浏览器");
				window.open("http://www.firefox.com.cn/");
			}							
        },
        methods:{
            login:function() {
				var page = this;

         		axios.post('/web/login.do',{
    				'id': page.name,
    				'password': page.pwd
  				}).then(function (response) {
				    if(response.data.success){
				    	var user = response.data.bean;
				    	if(user!=null){
				    		sessionStorage.setItem('loginUser',user.id);
				    		sessionStorage.setItem('userName',user.userName);
						    //登录20分钟后清空sessionStorage
						    setTimeout('sessionStorage.setItem("loginUser","");sessionStorage.setItem("userName","");',60000*20);
						    page.name='';
						    page.pwd= '';
						    page.$router.push({ path: '/main' });
				    	}else{
						    page.$message.error('用户不存在');
						    page.name='';
						    page.pwd= '';
						}
				    }else{
					    page.$message.error(response.data.message);
					    page.name='';
					    page.pwd= '';
					}
 				}).catch(function (error) {
    				console.log(error);
    				page.$message.error("系统出错了，请联系管理员");
				});

				/*sessionStorage.setItem('loginUser','a');
						    page.name=''
						    page.pwd= ''
						    page.$router.push({ path: '/main' })*/

            }
        }
    }
</script>

<style scoped>
	.login{
		width: 100%;
		height: 100%;
		background-color: #4d79cb;
		padding-top: 190px;
	}
	#loginDiv{
		width: 520px;
		height: 400px;
		margin-left: auto;
		margin-right: auto;
		background-color: #fff;
		padding: 44px 60px 0 60px;
	}
	#loginTitle{
		font-size: 38px;
		font-weight: bold;
		width: 360px;
		height: 74px;
		line-height: 68px;
		color: #06245e;
		margin: auto;
		text-align: center;
	}
	#loginForm{
		margin-top: 30px;
	}
	.login-btn{
		height: 40px;
		width: 400px;
		margin-top: 15px;
	}
	.login-btn:hover{
		height: 40px;
		width: 400px;
		margin-top: 15px;
		background-color: #598ff9;
	}
	.copyright{
		margin-top: 30px;
		text-align: center;
		color: #fff;
		font-size: 14px;
	}
	.myinput{
		height: 40px;
	}
</style>