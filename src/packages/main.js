import components from './index';
// import utils from '../src/utils';
import './styles/index.scss';

import { validatenull } from '@/utils/validate.js';
import { deepClone, vaildData } from '@/utils/util';

let prototypes = {
  deepClone,
  vaildData,
  validatenull,
};

function install(Vue, options = { extComponents: [] }) {
  console.log(options)
  if (install.installed) return;

  Object.keys(components).map(ele => {
    let component = components[ele];
    let name = component.name || '';
    name = name.substr(name.length - 1, 1) === '-' ? (name.substr(0, name.length - 1)) + ele : name;
    Vue.component(name, component);
  })
  options.extComponents.forEach(component => {
    Vue.component(component.name, component);
  });
  // Vue.prototype.$utils = utils
  Object.keys(prototypes).forEach((key) => {
    Vue.prototype[key] = prototypes[key];
  });
}

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

const Nvue = Object.assign({
  version: '',
  locale: '',
  install,
}, components);

export default Nvue;
