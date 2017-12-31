<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
export default {
    name: 'app'
}
</script>

<style>
html,body{
    height: 100%;
    margin: 0;
    padding: 0;
}
#app {
    height: 100%;
    font-family:"Microsoft YaHei",Arial,Helvetica,sans-serif,"SimSun";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

.mybtn{
    height: 30px;
    font-size: 14px;
    line-height: 15px;
    border-radius: 0px;
}
.blue-btn-lg{
    width: 100px;
    background-color: #377afe;
    color: #fff;
    border: none;
}
.blue-btn-lg:hover{
    width: 100px;
    background-color: #598ff9;
    color: #fff;
    border: none;
}
.blue-btn-sm{
    width: 80px;
    background-color: #377afe; 
    color: #fff;
    border: none;
}
.blue-btn-sm:hover,.white-btn-sm:hover{
    width: 80px;
    background-color: #598ff9; 
    color: #fff;
    border: none;
}
.white-btn-sm{
    width: 80px;
    background-color: #fff;
    color: #999;
    border: 1px solid #ccc;
}
.green-btn-lg{
    width: 100px;
    background-color: #2dcc70;
    color: #fff;
    border: none;
}
.green-btn-lg:hover{
    width: 100px;
    background-color: #24d770;
    color: #fff;
    border: none;
}
.myinput{
    width: 100%;
    height: 30px;
    border-radius: 0px;
    padding: 6px 12px;
    background-color: transparent;
    background-image: none;
    border: 1px solid #ccc;
    color: #333;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}

/*改变input的placeholder颜色*/
::-webkit-input-placeholder{/* 使用webkit内核的浏览器 */
    color: #b2b6be;
}    
:-moz-placeholder{/* Firefox版本4-18 */
    color: #b2b6be;
}                  
::-moz-placeholder{/* Firefox版本19+ */
    color: #b2b6be;
}                  
:-ms-input-placeholder{/* IE浏览器 */
    color: #b2b6be;
}           

/*数据区域*/
.main{
    height: 100%;
}
#workspace{
    width: 100%;
    height: 100%;
    position: absolute;
    padding: 70px 10px 10px 240px;
    background-color: #e6e8ec;
    min-height: 700px;
}
.page-list{
    width: 100%;
    height: 100%;
    position: relative;
}
.workpanel-head,.workpanel-foot{
    padding-top: 20px;
    width: 100%;
    height: 70px;
    background-color: #fff;
    position: absolute;
    z-index: 1000;
}
.workpanel-foot{
    bottom: 0;
    text-align: center;
}
.workpanel-main{
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-top: 80px solid #e6e8ec;
    border-bottom: 80px solid #e6e8ec;
    position: absolute;
    overflow-y: auto;
}
.workpanel-main-add{
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-top: 80px solid #e6e8ec;
    position: absolute;
    overflow-y: auto;
    text-align: left;
}
/*时间控件*/
.el-date-editor--daterange{
    width: 320px !important;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 130px;
}
.el-range-separator{
    width: 20px !important;
}
.el-date-editor--daterange{
    padding-top: 2px !important;
}
.el-input__inner{
    height: 30px !important;
    border-radius: 0 !important;
    font-size: 12px !important;
    border: 1px solid #ccc !important;
}
.el-input__icon{
    line-height: 30px !important;
}
.el-range__icon,.el-range__close-icon{
    margin-top: -3px !important;
}

/*搜索框相关*/
.timetool,.searchbox,.page-btn{
    float: right;
}
.page-btn{
    margin-right: 20px;
}
.searchbox,.timetool{
    margin-right: 30px;
}
.search-input{
    font-size: 12px;
}
/*表单*/
.my-form{
  width: 720px;
}
.form-title{
    height: 25px;
    line-height: 25px;
    font-size: 14px;
    color: #555;
    margin-left: 100px;
}
.redstar{
    color: red;
}
/*分页*/
.el-pagination__total{
    margin-left: 30px !important;
}
/*表格*/
th{
    background-color: #ebf1ff !important;
    border-top: 1px solid #337afd !important;
    border-bottom: 1px solid #ccc !important;
    color: #333 !important;
    font-size: 14px !important;
}
.center-tab{
    text-align: center !important;
}
.el-table__row{
    font-size: 13px !important;
}
.el-table__body-wrapper{
    overflow-x: hidden !important;
}
/*新增信息页*/
.add-top{
    background-color: #ebf1ff;
    border-top: 1px solid #337afd;
    border-bottom: 1px solid #ccc;
    color: #333;
    font-size: 14px;
    width: 100%;
    height: 40px;
    line-height: 37px;
    padding-left: 60px;
    font-weight: bold;
}

</style>
