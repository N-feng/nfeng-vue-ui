export default {
  // component: Form,
  title: "Example/Select",
  argTypes: {
    onChange: {
      table: {
        category: "Events",
      },
    },
    // onCancel: {
    //   table: {
    //     category: "Events",
    //   },
    // },
    // onSubmit: {
    //   table: {
    //     category: "Events",
    //   },
    // },
  },
};

const Template = (args) => {
  return {
    setup() {
      return { args };
    },
    template: '<y-select v-bind="args" />',
  };
};

//👇 Each story then reuses that template
export const Primary = Template.bind({});
const provinceData = ['Zhejiang', 'Jiangsu'];
Primary.args = { options: provinceData };