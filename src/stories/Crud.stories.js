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
    onRowSave: {
      table: {
        category: "Events",
      },
    },
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
  },
};

const Template = (args, { argTypes }) => {
  return {
    // components: { Form },
    props: Object.keys(argTypes),
    template: `
      <div>
        <p>tableData：{{tableData}}</p>
        <ygp-crud @onRowSave="onRowSave" @onRowUpdate="onRowUpdate" @onRowDel="onRowDel" v-bind="$props" :option="{...option,stripe,index}" :data="tableData" :dic="dic" />
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
  stripe: false,
  index: false,
}