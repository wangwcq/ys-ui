import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import lodash from 'lodash';
import axios from 'axios';
import App from './src/components/App.vue';

Vue.config.productionTip = false;

Vue.use(ElementUI);

window._ = lodash;
window.axios = axios;

function main(params = {}) {
  const { router = {} } = params;
  new Vue({
    router,
    render: h => h(App),
  }).$mount('#app');
}

export {
  Vue,
  lodash,
  axios,
  main,
};
