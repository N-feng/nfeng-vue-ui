import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
Vue.use(ElementUI);

import NfengUI from "../packages/main";
Vue.use(NfengUI);

import { previewTemplate } from "storybook-addon-preview";

import { base,
  // rules
} from "./options";

export default {
  title: "Example/Form",
  argTypes: {
    onCancel: {
      table: {
        category: "Events",
      },
    },
    onSubmit: {
      table: {
        category: "Events",
      },
    },
  },
};

let formData = {};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `
    <div>
      <p>formData：{{formData}}</p>
      <ygp-form @onCancel="onCancel" @onSubmit="onSubmit" v-bind="$props" v-model="formData" />
    </div>
  `,
});

// 基础
export const Base = Template.bind({});
Base.parameters = {
  preview: [
    {
      tab: "Vue",
      template: previewTemplate`
<div>
  <p>formData：{{formData}}</p>
  <ygp-form @onCancel="onCancel" @onSubmit="onSubmit" v-bind="$props" v-model="formData" />
</div>
      `,
      language: "html",
      copy: true,
    },
    {
      tab: "Js",
      template: previewTemplate`
data () {
  return {
    option: ${JSON.stringify(base)}
  }
}
      `,
      language: "js",
      copy: true,
    },
  ],
};
Base.args = {
  background: "#ff0",
  label: "Button",
  option: base,
  formData,
};

// 数据验证
// export const Rules = Template.bind({});
// Rules.args = {
//   option: rules,
//   formData,
// };
