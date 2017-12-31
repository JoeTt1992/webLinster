// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './router/routes'
import Login from './components/Login'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import axios from 'axios'
import Qs from 'qs'

Vue.use(VueRouter)
Vue.use(ElementUI)

const router = new VueRouter({
	mode: 'hash',
    base: '/web/',
	routes
});

// 全局导航钩子
router.beforeEach((to, from, next) => {
 //	alert(sessionStorage.getItem("loginUser"))
 	if (to.meta.requireAuth) {
 		if(sessionStorage.getItem("loginUser")!="" && sessionStorage.getItem("loginUser")!="null"
             && sessionStorage.getItem("loginUser")!=null) {   
            if((to.path.indexOf("user")!=-1 || to.path.indexOf("log")!=-1) && sessionStorage.getItem("loginUser")!="administrator"){
                next({
                    path: '/',
                    query: {redirect: to.fullPath}  
                })
            }else{
                next();
            }			
 		}
 		else { 
 			next({
 				path: '/',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
 		}
 	}
 	else {
 		next();
 	}
});

//axios配置
axios.defaults.transformRequest = function (data) {
    // 请求的data必须转为json串
    data = Qs.stringify(data);
    return data;
};
/*axios.defaults.transformResponse = function (data) {
    console.info("----")
    console.info(data.bean)
    // 对 data 进行任意转换处理
    // if(data.bean){
    return data.bean;
};*/
axios.defaults.responseType = "json";

// http request 请求拦截器
axios.interceptors.request.use(function(config){
    //如果sessionStorage中用户信息为空则直接回到登录页重新登录
    if ((sessionStorage.getItem("loginUser")=="" || sessionStorage.getItem("loginUser")==null)
         && config.url!="/login.do") { 
        router.replace({
            path: '/'
        });    
    }
    return config;
},function(error){  
    return Promise.reject(error)  
});

// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
/*axios.interceptors.response.use(function(response){
    console.info(response.data.code)
    return response;
},function(error){
    return Promise.reject(error)
}); */
/////////

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App }
});
