<template>
    <div class="main">
    <!--顶部-->
        <div id="top">
            <span id="title" @click="backToMain">天津国税网站监控</span>
            <button class="mybtn blue-btn-lg" id="logOut" @click="logout"><img src="../assets/images/logout.png"/>&nbsp;退出</button>
            <button class="mybtn blue-btn-lg" id="resetPwd" @click="changePwd"><img src="../assets/images/pwd.png"/>&nbsp;修改密码</button>
            <div id="userInfo">
                <img src="../assets/images/person_dot.png"/>
                <span id="userName">{{user}}</span>
            </div>
        </div>
        <!--左侧菜单-->
        <div id="menu">
            <div id="tabItem">
                <slider-item v-show="admin" icon="static/img/user_manage.png" parent-item="用户管理" 
                    :child-items="[{id:'1',name:'用户列表',link:'/main/user/list'}]">
                </slider-item>
                <slider-item icon="static/img/key_check.png" parent-item="关键栏目检查"
                    :child-items="[{id:'3',name:'信息维护',link:{path:'/main/key/result',query:{entrance: 'key'}}},{id:'2',name:'检测结果列表',link:{path:'/main/key/list',query:{entrance: 'key'}}}]">
                </slider-item>
                <slider-item icon="static/img/web_check.png" parent-item="网站检测" 
                    :child-items="[{id:'5',name:'信息维护',link:{path:'/main/web/result',query:{entrance: 'web'}}},{id:'4',name:'检测结果列表',link:{path:'/main/web/list',query:{entrance: 'web'}}}]">
                </slider-item>
                <slider-item icon="static/img/key_update_check.png" parent-item="关键栏目更新检测" 
                    :child-items="[{id:'7',name:'信息维护',link:{path:'/main/keyupdate/result',query:{entrance: 'keyupdate'}}},{id:'6',name:'检测结果列表',link:{path:'/main/keyupdate/list',query:{entrance: 'keyupdate'}}}]">
                </slider-item>
                <slider-item v-show="admin" icon="static/img/log_search.png" parent-item="日志查询" 
                    :child-items="[{id:'8',name:'日志列表',link:'/main/log/list'}]">
                </slider-item>
            </div>
        </div>
        <!--切换页面部分-->
        <div id="workspace"><router-view/></div>    
    </div>
</template>

<script>
import $ from 'jquery'
import Vue from 'vue'
import Menu from '@/components/tool/Menu'
import axios from 'axios'

export default {
    name: 'Main',
    data () {
        return {
            user: sessionStorage.getItem('userName'),
            admin: false
        }
    },
    created: function(){
        //f5或浏览器刷新页面时回到欢迎页
        this.$router.push({path: '/main'});
    },
    mounted: function(){
        var user = sessionStorage.getItem('loginUser');
        if(user=='administrator'){
            this.admin = true;
        }
    },
    methods:{
        //退出
  	    logout:function(){
            var page = this;
            axios.post("/web/logout.do").then(function (response) {
                if(response.data.success){
                    sessionStorage.setItem("loginUser","");
                    sessionStorage.setItem("userName","");
                    page.$router.push({path:"/"});
                }else{
                    page.$message.error(response.data.message);
                }
            }).catch(function (error) {
                console.log(error);
                page.$message.error("系统出错了，请联系管理员");
            });  		    
  	    },
        //到修改密码页
  	    changePwd:function(){
  		    this.$router.push({path: "/main/user/pwd"});
  	    },
        //点击网页标题回到首页
        backToMain: function(){
            this.$router.push({path: "/main"});
        }
    }
}

//左侧菜单
new Vue({
    name: "#tabItem"
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#top{
    width: 100%;
    height: 60px;
    line-height: 57px;
    background-color: #fff;
    -moz-box-shadow:0px 0px 4px #CCD4E4; 
    -webkit-box-shadow:0px 0px 4px #CCD4E4; 
    box-shadow:0px 0px 4px #CCD4E4;
    position: absolute;
    z-index:999;
}
#title{
    float: left;
    font-size: 22px;
    color: #06245e;
    font-weight: bold;
    margin-left: 20px;
    cursor: pointer;
}
#menu{
    height: 100%;
    width: 230px;
    background-color: #051433;
    padding-top: 60px;
    position: absolute;
    color: #9fb6e4;
    font-size: 15px;
    z-index:998;
    min-height: 700px;
}

.mybtn{
    float: right;
    margin-right: 20px;
    margin-top: 15px;
}

#userInfo{
    float: right;
    margin-right: 20px;
}
#userName{
    font-size: 14px;
    color: #555;
    margin-left: 5px;
}
</style>
