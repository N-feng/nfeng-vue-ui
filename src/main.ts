import { createApp } from 'vue';
import App from './App.vue';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import NfengUI from "./packages/main";

const app = createApp(App);

app.use(Antd);
app.use(NfengUI);
app.mount('#app');
