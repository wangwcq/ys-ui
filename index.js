import Vue from 'vue';
import ElementUI from 'element-ui';
import Router from 'vue-router';
import 'element-ui/lib/theme-chalk/index.css';
import lodash from 'lodash';
import axios from 'axios';
import App from './src/components/App.vue';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(Router);

window._ = lodash;
window.axios = axios;

function main(params = {}) {
  const { routes = [] } = params;

  const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
      {
        path: '/',
        name: 'app',
        component: App,
        children: routes,
      },
    ],
  });

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
