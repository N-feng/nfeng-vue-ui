import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
Vue.use(ElementUI);

import NfengUI from "../packages/main";
Vue.use(NfengUI);

import { base, selection } from "./options/crud";

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
    onSelectionChange: {
      table: {
        category: "Events",
      },
    },
    onSelectChange: {
      table: {
        category: "Events"
      }
    }
  },
};

const Template = (args, { argTypes }) => {
  return {
    // components: { Form },
    props: Object.keys(argTypes),
    template: `
      <div>
        <p>tableData：{{tableData}}</p>
        <ygp-crud
          @onRowSave="onRowSave"
          @onRowUpdate="onRowUpdate"
          @onRowDel="onRowDel"
          @onSelectionChange="onSelectionChange"
          @onSelectChange="onSelectChange"
          v-bind="$props"
          :option="{...option,stripe,index,selection,rowSelection}"
          :data="tableData"
          :dic="dic" />
      </div>
    `,
  };
};

const tableData = [
  {
    id: 1,
    name: "张三",
    sex: "男",
  },
  {
    id: 2,
    name: "李四",
    sex: "女",
  },
  {
    id: 3,
    name: "王五",
    sex: "女",
  },
  {
    id: 4,
    name: "赵六",
    sex: "男",
  },
];

// 基础
export const Base = Template.bind({});
Base.args = {
  option: base,
  tableData,
  dic: {},
  stripe: false,
  index: false,
  selection: false,
};

// 多选
export const Selection = Template.bind({});
Selection.args = {
  option: selection,
  tableData,
  dic: {},
  selectedRowKeys: [5],
  stripe: false,
  index: false,
  selection: true,
  rowSelection: false,
};
