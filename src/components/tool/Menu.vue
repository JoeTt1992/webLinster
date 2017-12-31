<template id="tab">
    <div id="tabPanel">
        <div class="item">
            <div class="menu" :class="{'menutitle-active':status,'menutitle':!status}" @click="toggle()">
                <img class="menu-icon" :src="icon"/>
                {{parentItem}}
                <img class="menu-down" src="../../assets/images/up.png" v-show="status"/>
                <img class="menu-down" src="../../assets/images/down.png" v-show="!status"/>
            </div>
            <dl class="sildermun" v-show="status">
                <router-link :to="child.link" v-for="child in childItems">
                    <dd class="menuchild" :id="child.id" @click="toggleChild(child)">{{child.name}}</dd>
                </router-link>               
            </dl>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import $ from 'jquery'

export default Vue.component('slider-item', {
    template: '#tab',
    props:['icon','parent-item','child-items'],
    data: function() {
        return {
            status: false
        }
    },
    methods: {
        //切换滑块
        toggle: function() {
            this.status = !this.status;
        },
        toggleChild: function(child){
            $(".menuchild").removeClass("menuchild-active");
            $("#"+child.id).addClass("menuchild-active");           
        }
    }
})
</script>

<style scoped>
    a {text-decoration: none; color: #9fb6e4;}
    a:link {text-decoration: none; color: #9fb6e4;} /*未访问颜色*/
    a:visited {text-decoration: none; color: #9fb6e4;} /*已访问颜色*/
    a:hover {text-decoration: none; color: #fff;} /*悬浮（鼠标经过）时颜色*/
    a:active {text-decoration: none; color: #fff;} /*点击时的颜色*/
    dl{
        margin-bottom: 0;
    }
    .menutitle,.menutitle-active{
        height: 54px;
        line-height: 54px;
        text-align: left;
        cursor: pointer;
        font-size: 14px;
    }
    .menutitle:hover,.menutitle-active:hover{
        height: 54px;
        line-height: 54px;
        text-align: left;
        cursor: pointer;
        background-color: #112a59;
        font-size: 14px;
    }
    .menutitle-active:hover{
        height: 54px;
        line-height: 54px;
        text-align: left;
        cursor: pointer;
        background-color: #0a1e45;
        font-size: 14px;
    }
    .menu-icon{
        margin-left: 30px;
        margin-right: 10px;
        margin-top: -2px;
    }
    .menuchild{
        height: 40px;
        line-height: 40px;
        background-color: #112a59;
        cursor: pointer;
        text-align: left;
        padding-left: 80px;
        font-size: 13px;
    }
    .menuchild:hover,.menuchild-active{
        height: 40px;
        line-height: 40px;
        background-color: #377afe;
        color: #fff;
        cursor: pointer;
        font-size: 13px;
    }
    .menu-down{
        float: right;
        margin-right: 20px;
        margin-top: 26px;
    }
    .router-link-active{
        height: 40px;
        line-height: 40px;
        background-color: #377afe;
        color: #fff;
        cursor: pointer;
    }
</style>