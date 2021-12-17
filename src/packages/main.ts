import components from './antd';
import '../styles/index.scss';

const install = (Vue, options = {}) => {
  Object.keys(components).map(ele => {
    let component = components[ele];
    let name = component.name || '';
    name = name.substr(name.length - 1, 1) === '-' ? (name.substr(0, name.length - 1)) + ele : name;
    Vue.component(name, component);
  })
}

export default {
  install,
};
