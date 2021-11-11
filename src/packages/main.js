import Crud from "./Crud/index.vue";
import Form from "./Form/index.vue";
import Input from "./Input/index.vue";
import Select from "./Select/index.vue";
import Radio from "./Radio/index.vue";
import Checkbox from "./Checkbox/index.vue";
import DatePicker from "./DatePicker/index.vue";
import DialogTable from "./DialogTable/index.vue";
// import CityPicker from "./CityPicker/index.vue";
// import Upload from "./Upload/index.vue";
// import utils from '../src/utils';
import './styles/index.scss';

const components = [
  Crud,
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  DialogTable,
  // Upload,
  // CityPicker,
];

function install(Vue, options = { extComponents: [] }) {
  if (install.installed) return;

  [...components, ...options.extComponents].forEach(component => {
    Vue.component(component.name, component);
  });
  // Vue.prototype.$utils = utils
}

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}
export {
  // utils,
  Crud,
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  DialogTable,
  // Upload,
  // CityPicker,
};
export default { install };
