import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
Vue.use(ElementUI);

import NfengUI from "../packages/main";
Vue.use(NfengUI);

import {base, search, selection, cell} from "./options/crud";

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
    },
    onSubmit: {
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
<!--        <p>tableData: {{tableData}}</p>-->
        <ygp-crud v-bind="$props" 
                  :option="{...option,stripe,index,selection,rowSelection}" 
                  :data="tableData" 
                  :dic="dic" 
                  @onRowSave="onRowSave" 
                  @onRowUpdate="onRowUpdate" 
                  @onRowDel="onRowDel" 
                  @onSelectionChange="onSelectionChange" 
                  @onSelectChange="onSelectChange" 
                  @onSubmit="onSubmit" />
      </div>
    `,
  };
};

const tableData = [
  {
    id: 1,
    name: "张三",
    sex: "男",
    age:18,
  },
  {
    id: 2,
    name: "李四",
    sex: "女",
    age:18,
  },
  {
    id: 3,
    name: "王五",
    sex: "女",
    age:22,
  },
  {
    id: 4,
    name: "赵六",
    sex: "男",
    age:22,
  },
];

// 基础
export const Base = Template.bind({});
Base.args = {
  option: base,
  tableData,
  dic: {},
  selectedRowKeys: [],
  stripe: false,
  index: false,
  selection: false,
  rowSelection: false,
};

// 多选
export const Selection = Template.bind({});
Selection.args = {
  option: selection,
  tableData,
  dic: {},
  selectedRowKeys: [3, 5],
  stripe: false,
  index: false,
  selection: true,
  rowSelection: false,
};

// 搜索
export const Search = Template.bind({});
Search.args = {
  option: search,
  tableData,
  dic: {},
  selectedRowKeys: [],
  stripe: false,
  index: false,
  selection: false,
  rowSelection: false,
}

// 行编辑
export const Cell = Template.bind({});
Cell.args = {
  option: cell,
  tableData,
  dic: {},
  selectedRowKeys: [],
  stripe: false,
  index: false,
  selection: false,
  rowSelection: false,
}
