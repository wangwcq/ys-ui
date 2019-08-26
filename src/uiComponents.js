import {
  Vue,
  lodash as _,
} from '../index';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

_.forEach(ElementUI, (item, name) => {
  if (typeof item === 'object') {
    Vue.component(`Ui${name}`, item);
  }
});