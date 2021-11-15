import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from "vue";
Vue.use(ElementUI)
// import MyButton from '../packages/Form/index.vue';

import NfengUI from '../packages/main'
Vue.use(NfengUI)

import { option } from './option';

export default {
  title: 'Example/Form',
  // component: MyButton,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    // value: {}
  },
};

const formData = {}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  // components: { MyButton },
  template: '<div><ygp-form v-bind="$props" v-model="formData" />{{formData}}</div>',
});

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Button',
  option,
  value: {},
  formData,
};

export const Result = () => ({
  template: '<div>1111</div>'
})
