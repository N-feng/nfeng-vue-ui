<template>
  <el-drawer
    lock-scroll
    :modal-append-to-body="false"
    append-to-body
    title="列显隐"
    :visible.sync="columnBox"
  >
    <div style="padding: 30px 10px 60px 30px;">
      <el-table ref="table" :key="Math.random()" :data="list" height="100%" size="small" border>
        <el-table-column align="center" width="100" header-align="center" prop="label" label="列名"></el-table-column>
        <template v-for="(item,index) in crud.defaultColumn">
          <el-table-column
            v-if="item.hide!=true"
            :key="index"
            :prop="item.prop"
            align="center"
            header-align="center"
            :label="item.label"
          >
            <template slot-scope="{row}">
              <el-checkbox v-model="crud.objectOption[row.prop][item.prop]"></el-checkbox>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </el-drawer>
</template>

<script>
import { arraySort } from "@/utils/util";

export default {
  inject: ["crud"],
  data() {
    return {
      columnBox: false,
    };
  },
  computed: {
    list() {
      let list = [];
      for (var o in this.crud.objectOption) {
        const ele = this.crud.objectOption[o];
        if (ele.showColumn != false) {
          list.push(Object.assign(ele, { prop: o }));
        }
      }
      list = arraySort(
        list,
        "index",
        (a, b) =>
          this.crud.objectOption[a.prop]?.index -
          this.crud.objectOption[b.prop]?.index
      );
      return list;
    },
  },
};
</script>
