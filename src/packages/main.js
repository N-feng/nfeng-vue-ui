import components from './components';
// import utils from '../src/utils';
import './styles/index.scss';

import { validatenull } from '../utils/validate.js';
import { deepClone, vaildData } from '../utils/util';

let prototypes = {
  deepClone,
  vaildData,
  validatenull,
};

function install(Vue, options = { extComponents: [] }) {
  if (install.installed) return;
  Object.keys(components).map(ele => {
    let component = components[ele];
    let name = component.name || '';
    name = name.substr(name.length - 1, 1) === '-' ? (name.substr(0, name.length - 1)) + ele : name;
    Vue.component(name, component);
  })
  Object.keys(prototypes).forEach((key) => {
    Vue.prototype[key] = prototypes[key];
  });
  const opts = Object.assign(options, {
    ui: (() => {
      const config = {
        is: '$isEle',
        name: 'element-ui',
        type: 'el'
      }
      Vue.prototype[config.is] = true;
      return config
    })(),
    extComponents: options.extComponents || []
  })
  opts.extComponents || [].forEach(component => {
    Vue.component(component.name, component);
  });
  // Vue.prototype.$utils = utils
  Vue.prototype.$YGP = opts;
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
