import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
Vue.use(ElementUI);

import NfengUI from "../packages/main";
Vue.use(NfengUI);

import { base } from "./options/crud";

export default {
  // component: Form,
  title: "Example/Crud",
  argTypes: {
    onRowUpdate: {
      table: {
        category: "Events",
      },
    },
    onRowDel: {
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

const Template = (args, { argTypes }) => {
  return {
    // components: { Form },
    props: Object.keys(argTypes),
    template: `
      <div>
        <p>tableData：{{tableData}}</p>
        <ygp-crud @onRowUpdate="onRowUpdate" @onRowDel="onRowDel" @onSubmit="onSubmit" v-bind="$props" :data="tableData" :dic="dic" />
      </div>
    `,
  };
};

// 基础
export const Base = Template.bind({});
Base.args = {
  option: base,
  tableData: [
    {
      name:'张三',
      sex:'男'
    }, {
      name:'李四',
      sex:'女'
    }, {
      name:'王五',
      sex:'女'
    }, {
      name:'赵六',
      sex:'男'
    }
  ],
  dic: {},
}