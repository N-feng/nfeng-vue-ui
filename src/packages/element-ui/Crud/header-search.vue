<template>
  <el-collapse-transition>
    <el-card shadow="never"
             :class="b()"
             v-if="searchShow && searchFlag">
      <ygp-form
        v-model="searchForm"
        :option="option"
        ref="form"
        :dic="crud.dic"
        @onSubmit="searchChange"
        @reset-change="resetChange"
      >
        <template slot="menuForm" slot-scope="scope">
          <slot
            name="searchMenu"
            v-bind="Object.assign(scope, {search:searchForm, row: searchForm})"
          ></slot>
          <template v-if="isSearchIcon">
            <el-button type="text"
                       v-if="show===false"
                       @click="show=true"
                       icon="el-icon-arrow-down">展开</el-button>
            <el-button type="text"
                       v-if="show===true"
                       @click="show=false"
                       icon="el-icon-arrow-up">收起</el-button>
          </template>
        </template>
      </ygp-form>
    </el-card>
  </el-collapse-transition>
</template>

<script>
import {deepClone, vaildData} from "../../utils/util";
import {formInitVal, getSearchType} from "../../common/dataformat";
import create from "../../common/create";
export default create({
  name: "crud__search",
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
      show: false,
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
    isSearchIcon () {
      return vaildData(this.crud.option.searchIcon, true) === true && this.columnLen > this.searchIndex
    },
    searchIndex () {
      return this.crud.option.searchIndex || 3
    },
    columnLen () {
      let count = 0;
      this.crud.propOption.forEach(ele => {
        if (ele.search) count++
      })
      return count
    },
    option() {
      const option = this.crud.option;
      const detailColumn = (list = []) => {
        let column = [];
        let count = 0;
        //根据order排序
        list.forEach((ele) => {
          if (ele.search) {
            let isCount = count < this.searchIndex
            ele = Object.assign(ele, {
              type: getSearchType(ele),
              order: ele.searchOrder,
              span: ele.searchSpan || option.searchSpan,
              rules: ele.searchRules,
              value: ele.searchValue,
              range: ele.range || ele.searchRange,
              display: this.isSearchIcon ? (this.show ? true : isCount) : true,
            });
            column.push(ele);
            count = count + 1;
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
          submitText: '搜 索',
          menuSpan: option.searchMenuSpan,
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
  created() {
    this.initFun();
  },
  methods: {
    handleSubmit (formData) {
      this.crud.$emit("onSubmit", formData)
    },
    initFun () {
      ['searchReset', 'searchChange'].forEach(ele => this.crud[ele] = this[ele])
    },
    // 搜索回调
    searchChange (form, done) {
      this.$emit("update:searchForm", form);
      this.crud.onLoad();
      this.crud.$emit("search-change", form, done);
    },
    // 搜索清空
    resetChange () {
      // this.searchForm = deepClone(this.defaultForm.tableForm);
      // this.$emit("update:searchForm", this.defaultForm.tableForm);
      this.crud.onLoad();
      this.crud.$emit("search-reset", this.defaultForm.tableForm);
    },
    // 搜索清空
    searchReset () {
      this.$refs.form.resetForm();
    },
    handleSearchShow() {
      this.searchShow = !this.searchShow;
    },
    dataFormat () {
      this.defaultForm = formInitVal(this.option.items);
      this.searchForm = deepClone(this.defaultForm.tableForm);
      this.$emit('update:searchForm', this.searchForm);
    }
  },
});
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