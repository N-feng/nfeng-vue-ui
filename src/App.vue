<template>
  <div id="app">
<!--    <img alt="Vue logo" src="./assets/logo.png">-->
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <el-button @click="addNextRow">向下添加</el-button>
    <ygp-crud :option="option"
              :data="tableData"
              :dic="dic" />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import {cell} from "./stories/options/crud";

export default {
  name: 'App',
  // components: {
  //   HelloWorld,
  // },
  data() {
    return {
      option: cell,
      dic: {},
      tableData: [{
        id:1,
        name:"张三",
        sex:"男",
        age:18,
      },{
        id:2,
        name:"李四",
        sex:"女",
        age:18,
      },{
        id:3,
        name:"王五",
        sex:"女",
        age:22,
      },{
        id:4,
        name:"赵六",
        sex:"男",
        age:22,
      },
        {
          id:5,
          sex:1,
          age:18,
          $cellEdit:true
        }
      ]
    }
  },
  methods: {
    addNextRow(){
      this.tableData.push({
        // id:6,
        name:"赵六",
        sex:"男",
        age:22,
        $cellEdit:true
      })
    },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
