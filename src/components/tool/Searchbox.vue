<template id="searchbox">
    <div class="searchbox">        
        <input type="text" class="myinput search-input" :placeholder="placeholder" v-model="param" maxlength="100">
        <input class="search-btn" type="button" @click="sea"/>
    </div>  
</template>

<script>
import Vue from 'vue'

export default Vue.component('my-searchbox', {
    template: '#searchbox',
    props:['placeholder'],
    data(){
        return{
            param: ''
        }
    },
    methods:{
        sea:function(){
            this.$emit("search");
        }
    }
})
</script>

<style scoped>     
    input{
        width: 230px;
        position: absolute;
    }
    .search-btn{
        height: 30px;
        width: 40px;
        background: url('../../assets/images/search.png') no-repeat center center;
        border: none;
        border-left: 1px solid #ddd;
        position: relative;
        background-color: transparent;
        margin-left: 190px;
    }
</style>