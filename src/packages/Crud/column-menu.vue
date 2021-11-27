<template>
  <!-- 操作栏 -->
  <el-table-column
    v-if="vaildData(crud.tableOption.menu, true)&&crud.getPermission('menu')"
    fixed="right"
    label="操作"
    align="center"
    :width="crud.tableOption.menuWidth || 200"
  >
    <template slot-scope="{row,$index}">
      <template v-if="['button','text','icon'].includes(menuType)">
        <template v-if="crud.tableOption.cellBtn">
          <el-button
            v-if="vaildData(crud.tableOption.editBtn,true)&&!crud.editableKeys.includes(crud.handleGetRowKeys(row))"
            v-permission="crud.getPermission('viewBtn',row,$index)"
            type="text"
            size="small"
            icon="el-icon-edit"
            @click.stop="crud.rowCell({...row,$cellEdit:true})"
          >编辑</el-button>
          <el-button
            v-if="vaildData(crud.tableOption.editBtn,true)&&crud.editableKeys.includes(crud.handleGetRowKeys(row))"
            v-permission="crud.getPermission('saveBtn',row,$index)"
            type="text"
            size="small"
            icon="el-icon-edit"
            @click.stop="crud.rowCell({...row,$cellEdit:false}, $index)"
          >保存</el-button>
          <el-button :type="menuText('danger')"
                     icon="el-icon-circle-close"
                     :size="crud.isMediumSize"
                     @click.stop="crud.rowCancel(row,$index)"
                     v-if="crud.editableKeys.includes(crud.handleGetRowKeys(row))">
            <template v-if="!isIconMenu">
              取 消
            </template>
          </el-button>
        </template>
        <el-button
          v-if="crud.tableOption.viewBtn"
          v-permission="crud.getPermission('viewBtn',row,$index)"
          type="text"
          size="small"
          icon="el-icon-view"
          @click="crud.rowView(row,$index)"
        >查看</el-button>
        <el-button
          v-if="vaildData(crud.tableOption.editBtn,true)&&!crud.tableOption.cellBtn"
          v-permission="crud.getPermission('editBtn',row,$index)"
          type="text"
          size="small"
          icon="el-icon-edit"
          @click.stop="crud.rowEdit(row,$index)"
        >编辑</el-button>
        <el-popconfirm
          v-if="vaildData(crud.tableOption.delBtn,true)"
          v-permission="crud.getPermission('delBtn',row,$index)"
          class="btn-del"
          confirm-button-text="好的"
          cancel-button-text="不用了"
          icon="el-icon-info"
          icon-color="red"
          :title="crud.tableOption.delTitle||'确定删除吗？'"
          @confirm="crud.rowDel(row,$index)"
        >
          <el-button slot="reference" type="text" size="small" icon="el-icon-delete">删除</el-button>
        </el-popconfirm>
      </template>

      <slot name="menu" :row="row" size="small" :index="$index"></slot>
    </template>
  </el-table-column>
</template>

<script>
import permission from '../../utils/permission';
import { vaildData } from "../../utils/util";

export default {
  inject: ["crud"],
  directives: {
    permission
  },
  computed: {
    menuType() {
      return this.crud.tableOption.menuType || "text";
    },
    isIconMenu () {
      return this.menuType === "icon"
    },
    isMenu() {
      return this.menuType === "menu";
    },
  },
  methods: {
    vaildData,
    menuText (value) {
      return ['text', 'menu'].includes(this.menuType) ? "text" : value;
    },
  }
};
</script>
