// import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
// import Vue from "vue";
// import NfengUI from "../packages/main";
import {base, search, selection, cell, html, view, height} from "./options/crud";
// import {previewTemplate} from "storybook-addon-preview";
//
// Vue.use(ElementUI);
// Vue.use(NfengUI);

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
    },
    onLoad: {
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
      <el-button></el-button>
<!--        <p>tableData: {{tableData}}</p>-->
<!--        <ygp-crud v-bind="$props" -->
<!--                  :option="{...option,stripe,index,selection,rowSelection,cellBtn}" -->
<!--                  :data="tableData" -->
<!--                  :dic="dic" -->
<!--                  @onRowSave="onRowSave" -->
<!--                  @onRowUpdate="onRowUpdate" -->
<!--                  @onRowDel="onRowDel" -->
<!--                  @onSelectionChange="onSelectionChange" -->
<!--                  @onSelectChange="onSelectChange" -->
<!--                  @onSubmit="onSubmit" -->
<!--                  @row-update="addUpdate" -->
<!--                  @row-save="rowSave" -->
<!--                  @onLoad="onLoad">-->
<!--          <template v-if="option.menuType === 'menu'" slot-scope="scope" slot="menuBtn">-->
<!--            <el-dropdown-item divided @click.native="tip">自定义按钮</el-dropdown-item>-->
<!--          </template>-->
<!--          <template v-if="option.menuType === 'menu'" slot-scope="scope" slot="menu" >-->
<!--            <el-button style="margin-left:10px;" size="small" type="text" icon="el-icon-user" @click.native="tip">自定义按钮</el-button>-->
<!--          </template>-->
<!--        </ygp-crud>-->
      </div>
    `,

    methods: {
      rowSave(form, done) {
        console.log(form)
        this.$message.success(
          '新增数据' + JSON.stringify(form)
        )
        done({id:this.tableData.length})
      },
      addUpdate (form,index,done,loading) {
        console.log(form)
        this.$message.success('模拟网络请求')
        setTimeout(() => {
          this.$message.success('关闭按钮等待')
          loading()
        }, 1000)
        setTimeout(() => {
          this.$message.success(
            '编辑数据' + JSON.stringify(form) + '数据序号' + index
          )
          done({sexName:'女'})
        }, 2000)
      },
      tip(){
        this.$message.success('自定义按钮');
      }
    }
  };
};

// const parameters = {
//   preview: [
//     {
//       tab: "Vue",
//       template: previewTemplate`
// <ygp-crud v-bind="$props"
//           :option="{...option,stripe,index,selection,rowSelection,cellBtn}"
//           :data="tableData"
//           :dic="dic"
//           @onRowSave="onRowSave"
//           @onRowUpdate="onRowUpdate"
//           @onRowDel="onRowDel"
//           @onSelectionChange="onSelectionChange"
//           @onSelectChange="onSelectChange"
//           @onSubmit="onSubmit" />`,
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

const tableData = [{
    id:1,
    name:"张三",
    sex:"男",
    age:18,
    address:'码云的地址',
  },{
    id:2,
    name:"李四",
    sex:"女",
    age:18,
    address:'码云的地址',
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
  },{
  id:5,
  name:"孙七",
  sex:"男",
  age:22,
},{
  id:6,
  name:"周八",
  sex:"女",
  age:22,
},{
  id:7,
  name:"吴九",
  sex:"女",
  age:22,
},{
  id:8,
  name:"郑十",
  sex:"男",
  age:22,
}];

// 基础
export const Base = Template.bind({});
// Base.parameters = parameters;
Base.args = {
  option: base,
  tableData,
  // height: 230,
  dic: {},
  selectedRowKeys: [],
  stripe: false,
  index: false,
  selection: false,
  rowSelection: false,
  cellBtn: false,
  page: {}
};

// 合并菜单
export const Menu = Template.bind({});
// Menu.parameters = parameters;
Menu.args = {
  ...Base.args,
  option: {
    ...base,
    menuType:'menu',
    menuBtnTitle:'自定义名称',
  },
}

// 固定列和表头
export const Height = Template.bind({});
// Height.parameters = parameters;
Height.args = {
  ...Base.args,
  option: height,
  tableData,
  // height: 280,
};

// html语法转义
export const Html = Template.bind({});
// Html.parameters = parameters;
Html.args = {
  ...Base.args,
  option: html,
  tableData,
};

// 查看内容
export const View = Template.bind({});
// View.parameters = parameters;
View.args = {
  ...Base.args,
  option: view,
  tableData,
};

// 多选
export const Selection = Template.bind({});
// Selection.parameters = parameters;
Selection.args = {
  ...Base.args,
  option: selection,
  selectedRowKeys: [3, 5],
  selection: true,
};

// 搜索
export const Search = Template.bind({});
// Search.parameters = parameters;
Search.args = {
  ...Base.args,
  option: search,
};

// 分页
export const Page = Template.bind({});
// Page.parameters = parameters;
Page.args = {
  ...Search.args,
  page: {
    total: 40
  }
};

// 行编辑
export const Cell = Template.bind({});
// Cell.parameters = parameters;
Cell.args = {
  ...Base.args,
  option: cell,
  cellBtn: true,
}
