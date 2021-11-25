<template>
  <div style="width: 100%;">
    <YgpCrud
      ref="main"
      :dic="dic"
      :option="option"
      :data="text"
      @change="(value, option, column, scope) => $emit('change', value, option, column, scope)"
    >
      <template slot="menu" slot-scope="scope">
        <slot name="menuDynamic" v-bind="scope"></slot>
      </template>
      <template v-for="item in columnSlot" :slot="getSlotName({prop:item},'F')" slot-scope="scope">
        <slot v-bind="scope" :name="item"></slot>
      </template>
    </YgpCrud>
  </div>
</template>

<script>
  import create from '../../common/create';
  import props from "../../common/props";
  import event from "../../common/event";

export default create({
  name: "dynamic",
  mixins: [props(), event()],
  props: {
    columnSlot: {
      type: Array,
      default: () => {
        return [];
      },
    },
    children: {
      type: Object,
      default: () => {
        return {};
      },
    },
    dic: {
      type: Object,
    },
  },
  computed: {
    showType() {
      return this.children.type || "crud";
    },
    isForm() {
      return this.showType === "form";
    },
    isCrud() {
      return this.showType === "crud";
    },
    option() {
      return Object.assign(
        {},
        (() => {
          let option = this.deepClone(this.children);
          return option;
        })()
      );
    },
  },
  methods: {
    getSlotName(item = {}, type = "D", slot) {
      let result = {
        F: "Form",
        H: "Header",
        E: "Error",
        L: "Label",
        S: "Search",
        T: "Type",
        D: "",
      };
      let name = item.prop + result[type];
      if (slot) return slot[name];
      return name;
    },
  },
});
</script>