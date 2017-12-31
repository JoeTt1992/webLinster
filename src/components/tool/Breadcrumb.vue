<template id="breadcrumb">
    <div class="breadcrumb">
        <span class="grey">当前位置：</span>
        <span>{{level1}}</span>&nbsp;/
        <span>{{level2}}</span>
    </div>   
</template>

<script>
import Vue from 'vue'

export default Vue.component('my-breadcrumb', {
    template: '#breadcrumb',
    props:['level1','level2']
})
</script>

<style scoped>  
    .breadcrumb{
        font-size: 14px;
        color: #333;
        margin-top: -4px;
        background-color: #fff;
        float: left;
        margin-left: 5px;
    }
    .grey{
        color: #999;
    }
</style>