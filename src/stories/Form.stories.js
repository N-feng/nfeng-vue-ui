import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from "vue";
Vue.use(ElementUI)
// import MyButton from '../packages/Form/index.vue';

import NfengUI from '../packages/main'
Vue.use(NfengUI)

import { option } from './option';

export default {
  title: 'Example/Form',
  // component: MyButton,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    // value: {},
    onClick: { action: 'clicked' },
    // Assigns the argType to the Events category
    onCancel: {
      table: {
        category: 'Events'
      }
    },
    onSubmit: {
      table: {
        category: 'Events'
      }
    },
  },
  parameters: { actions: { argTypesRegex: '^on.*' } },
};

let formData = {}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  // components: { MyButton },
  template: '<ygp-form @onCancel="onCancel" @onSubmit="onSubmit" v-bind="$props" v-model="formData" />',
});

export const Base = Template.bind({});
Base.args = {
  label: 'Button',
  option,
  value: {},
  formData,
};

export const Result = () => ({
  template: '<div>1111</div>'
})
