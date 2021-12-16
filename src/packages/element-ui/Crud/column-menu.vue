<template>
  <!-- 操作栏 -->
  <el-table-column
    v-if="vaildData(crud.tableOption.menu, true)&&crud.getPermission('menu')"
    fixed="right"
    label="操作"
    align="center"
    :width="crud.tableOption.menuWidth || 220"
  >
    <template slot-scope="{row,$index}">
      <el-dropdown v-if="isMenu"
                   :size="crud.isMediumSize">
        <el-button type="text"
                   :size="crud.isMediumSize">
          {{ crud.tableOption.menuBtnTitle || t('crud.menuBtn')}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-view"
                            v-if="vaildData(crud.tableOption.viewBtn,true)"
                            v-permission="crud.getPermission('viewBtn',row,$index)"
                            @click.native="crud.rowView(row,$index)">查看</el-dropdown-item>
          <el-dropdown-item icon="el-icon-edit"
                            v-if="vaildData(crud.tableOption.editBtn,true)"
                            v-permission="crud.getPermission('editBtn',row,$index)"
                            @click.native="crud.rowEdit(row,$index)">编辑</el-dropdown-item>
<!--          <el-dropdown-item :icon="config.copyBtnIcon"-->
<!--                            v-if="vaildData(crud.tableOption.copyBtn,config.copyBtn)"-->
<!--                            v-permission="crud.getPermission('copyBtn',row,$index)"-->
<!--                            @click.native="crud.rowCopy(row)">{{t('crud.copyBtn')}}</el-dropdown-item>-->
<!--          <el-dropdown-item :icon="config.delBtnIcon"-->
<!--                            v-if="vaildData(crud.tableOption.delBtn,config.delBtn)"-->
<!--                            v-permission="crud.getPermission('delBtn',row,$index)"-->
<!--                            @click.native="crud.rowDel(row,$index)">{{t('crud.delBtn')}}</el-dropdown-item>-->
          <slot name="menuBtn"
                :row="row"
                :type="menuText('primary')"
                :disabled="crud.btnDisabled"
                :size="crud.isMediumSize"
                :index="$index"></slot>
        </el-dropdown-menu>
      </el-dropdown>
      <template v-else-if="['button','text','icon'].includes(menuType)">
        <template v-if="crud.tableOption.cellBtn">
          <el-button
            v-if="vaildData(crud.tableOption.editBtn,true)&&!row.$cellEdit"
            v-permission="crud.getPermission('viewBtn',row,$index)"
            type="text"
            icon="el-icon-edit"
            size="small"
            :disabled="crud.btnDisabledList[$index]"
            @click.stop="crud.rowCell(row, $index)"
          >编辑</el-button>
          <el-button
            v-if="vaildData(crud.tableOption.editBtn,true)&&row.$cellEdit"
            v-permission="crud.getPermission('saveBtn',row,$index)"
            type="text"
            icon="el-icon-edit"
            size="small"
            :disabled="crud.btnDisabledList[$index]"
            @click.stop="crud.rowCell(row, $index)"
          >保存</el-button>
          <el-button :type="menuText('danger')"
                     icon="el-icon-circle-close"
                     :size="crud.isMediumSize"
                     :disabled="crud.btnDisabledList[$index]"
                     @click.stop="crud.rowCancel(row,$index)"
                     v-if="row.$cellEdit">
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
          v-if="vaildData(crud.tableOption.delBtn,true) && !row.$cellEdit"
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
