<template>
  <el-switch
    v-model="text"
    :active-text="active[labelKey]"
    :active-value="active[valueKey]"
    :inactive-value="inactive[valueKey]"
    :inactive-text="inactive[labelKey]"
    :active-color="activeColor"
    :inactive-color="inactiveColor"
  ></el-switch>
</template>

<script>
import create from "../../common/create.js";
import props from "../../common/props.js";
import event from "../../common/event.js";

export default create({
  name: "switch",
  mixins: [props(), event()],
  props: {
    activeColor: String,
    inactiveColor: String,
  },
  computed: {
    active() {
      return this.options[1] || {};
    },
    inactive() {
      return this.options[0] || {};
    },
  },
});
</script>
