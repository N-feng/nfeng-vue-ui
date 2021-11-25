<template>
  <el-collapse-transition>
    <el-card v-if="searchShow && searchFlag" shadow="never">
      <ygp-form
        v-model="searchForm"
        :option="option"
        :dic="crud.dic"
        @onSubmit="handleSubmit"
      >
        <template slot="menuForm" slot-scope="scope">
          <slot
            name="searchMenu"
            v-bind="Object.assign(scope, {search:searchForm, row: searchForm})"
          ></slot>
        </template>
      </ygp-form>
    </el-card>
  </el-collapse-transition>
</template>

<script>
import { deepClone } from "../../utils/util";
import {formInitVal} from "../../common/dataformat";

export default {
  name: "HeaderSearch",
  inject: ["crud"],
  props: {
    search: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      defaultForm: {
        searchForm: {}
      },
      searchShow: true,
      searchForm: {},
    };
  },
  computed: {
    propOption() {
      let list = [];
      let groupList = this.crud.tableOption.group;
      if (groupList) {
        groupList.forEach((ele) => {
          (ele.column || []).forEach((column) => {
            list.push(column);
          });
        });
      }
      return [...list, ...this.crud.columnOption];
    },
    option() {
      const option = this.crud.option;
      const detailColumn = (list = []) => {
        let column = [];
        //根据order排序
        list.forEach((ele) => {
          if (ele.search) {
            ele = Object.assign(ele, {
              order: ele.searchOrder,
              rules: ele.searchRules,
              value: ele.searchValue,
              range: ele.range || ele.searchRange,
            });
            column.push(ele);
          }
        });
        return column;
      };
      const dataDetail = (list = []) => {
        let result = deepClone(list);
        if (result.group) {
          delete result.group;
        }
        result.items = detailColumn(deepClone(this.propOption));
        result = Object.assign(result, {
          search: true,
          submitText: '搜 索'
        });
        return result;
      };
      let result = dataDetail(option);
      return result;
    },
    searchFlag() {
      return this.option.items.length;
    },
  },
  watch: {
    'crud.propOption': {
      handler () {
        this.dataFormat();
      },
      immediate: true,
    },
    search: {
      handler() {
        this.searchForm = Object.assign(this.searchForm, this.search);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleSubmit (formData) {
      this.crud.$emit("onSubmit", formData)
    },
    handleSearchShow() {
      this.searchShow = !this.searchShow;
    },
    dataFormat () {
      this.defaultForm = formInitVal(this.option.items);
    }
  },
};
</script>

<style lang="scss">
.crud-component .el-card {
  border: none;
}
.crud-component .el-card__body {
  padding: 0;
}
// .crud-component .base-form {
//   padding: 16px 16px 4px;
// }
</style>