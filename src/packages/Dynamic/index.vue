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
export default {
  name: "YgpDynamic",
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
    value: {},
    dic: {
      type: Object,
    },
  },
  data() {
    return {
      text: undefined,
    };
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
  watch: {
    value: {
      handler() {
        this.initVal();
      },
      immediate: true,
    },
  },
  methods: {
    initVal() {
      this.text = this.value;
    },
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
};
</script>