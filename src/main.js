import Vue from 'vue'
import App from './App.vue'
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import NfengUI from "./packages/main";

Vue.use(ElementUI);
Vue.use(Antd);
Vue.use(NfengUI, {
  ui: {
    is: '$isAnt',
    name: 'antd',
    type: 'a'
  }
});

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
