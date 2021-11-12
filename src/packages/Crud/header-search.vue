<template>
  <el-collapse-transition>
    <el-card v-show="searchShow && searchFlag" shadow="never">
      <ygp-form
        v-model="searchForm"
        :option="option"
        :dic="crud.dic"
        @submit="formData => $emit('submit', formData)"
        @reset="formData => $emit('reset', formData)"
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
// import QueryFilter from "../Form/QueryFilter.vue";

export default {
  name: "HeaderSearch",
  // components: { QueryFilter },
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
    search: {
      handler() {
        this.searchForm = Object.assign(this.searchForm, this.search);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleSearchShow() {
      this.searchShow = !this.searchShow;
    },
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