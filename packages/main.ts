import components from './ui/antd';
import { KEY_COMPONENT_NAME } from './global/variable';
import '../styles/index.scss';

const install = (Vue, options = {}) => {
  Object.keys(components).map(ele => {
    let component = components[ele];
    let name = component.name || '';
    // name = name.substr(name.length - 1, 1) === '-' ? (name.substr(0, name.length - 1)) + ele : name;
    // name = KEY_COMPONENT_NAME + name;
    console.log(name)
    Vue.component(name, component);
  })
}

export default {
  install,
};
