import elementPlus from 'element-plus';
import "element-plus/dist/index.css";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import NfengUI from "../packages/main";
import { app } from '@storybook/vue3'

app.use(elementPlus);
app.use(Antd);
app.use(NfengUI);
// export const decorators = [
//   (story) => ({
//     components: { story, elementPlus },
//     template: '<elementPlus><story/></elementPlus>'
//   })
// ];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}