// import elementPlus from 'element-plus';
// import { app } from '@storybook/vue3'

// app.use(elementPlus);
// export const decorators = [
//   (story) => ({
//     components: { story, elementPlus },
//     template: '<elementPlus><story/></elementPlus>'
//   })
// ];
import "element-plus/dist/index.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}