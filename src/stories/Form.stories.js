// import Vue from "vue";
// import ElementPlus from "element-plus";
// import "element-plus/dist/index.css";
// import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';
// import NfengUI from "../packages/main";
//
// Vue.use(ElementPlus);
// Vue.use(Antd);
// Vue.use(NfengUI);

// import Form from '../packages/Form/index.vue';

// import { previewTemplate } from "storybook-addon-preview";

import { base, dic, dynamic, rules } from "./options/form";

export default {
  // component: Form,
  title: "Example/Form",
  argTypes: {
    onChange: {
      table: {
        category: "Events",
      },
    },
    onCancel: {
      table: {
        category: "Events",
      },
    },
    onSubmit: {
      table: {
        category: "Events",
      },
    },
  },
};

const Template = (args) => {
  return {
    setup() {
      return { args };
    },
    template: '<y-form v-bind="args" />',
  };
};

// const parameters = {
//   preview: [
//     {
//       tab: "Vue",
//       template: previewTemplate`
// <ygp-form
//   @onCancel="onCancel"
//   @onSubmit="onSubmit"
//   v-bind="$props"
//   v-model="formData"
//   :dic="dic" />`,
//       language: "html",
//       copy: true,
//     },
//     {
//       tab: "Js",
//       template: previewTemplate`
// data () {
//   return {
//     dic: {},
//     option: {},
//   }
// }`,
//       language: "js",
//       copy: true,
//     },
//   ],
// };

// 基础
export const Base = Template.bind({});
// Base.parameters = parameters;
Base.args = {
  option: base,
  formData: {},
  dic: {
    VAILD: [
      {
        name: "真",
        code: "true",
      },
      {
        name: "假",
        code: "false",
      },
    ],
    SEX: [
      {
        name: "男",
        code: "0",
      },
      {
        name: "女",
        code: "1",
      },
    ],
  },
};

// 数据验证
export const Rules = Template.bind({});
// Rules.parameters = parameters;
Rules.args = {
  option: rules,
  formData: {},
  dic: {},
};

// 数据字典
export const Dic = Template.bind({});
// Dic.parameters = parameters;
Dic.args = {
  option: dic,
  formData: {},
  dic: {
    text: [
      {
        name: "本地字典1",
        code: 0,
      },
      {
        name: "本地字典2",
        code: 1,
      },
    ],
  },
};

// 子表单
export const Dynamic = Template.bind({});
// Dynamic.parameters = parameters;
Dynamic.args = {
  option: dynamic,
  formData: {
    dynamic: [{
      input: 1,
      select: 1,
      selectName: '测试1',
      checkbox: 1,
      checkboxName: '测试1',
      radio: 1,
      switch: 2,
      switchName: '测试2',
      number: 100
    }, {
      input: 2,
      select: 2,
      selectName: '测试2',
      checkbox: 2,
      checkboxName: '测试2',
      radio: 1,
      switch: 1,
      switchName: '测试1',
      number: 99,
    }]
  },
  dic: {},
}
