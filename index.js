import Vue from 'vue';
import Router from 'vue-router';
import lodash from 'lodash';
import axios from 'axios';
import moment from 'moment-timezone';
import numeral from 'numeral';

import App from './components/App.vue';
import mixinWithLoading from './mixins/withLoading';
import mixinHandleRes from './mixins/handleRes';
import mixinGlobalData from './mixins/globalData';
import * as views from './views';

import './uiComponents';

Vue.config.productionTip = false;

Vue.use(Router);

Vue.mixin(mixinWithLoading);
Vue.mixin(mixinHandleRes);
Vue.mixin(mixinGlobalData);

const _ = lodash;

window._ = _;
window.axios = axios;

function main(params = {}) {
  const {
    routes = []
  } = params;

  const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
      path: '/',
      name: 'app',
      component: App,
      children: [
        ...routes,
        {
          path: '*',
          name: 'Miss',
          component: views.ErrorView,
        },
      ],
    }, ],
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
  moment,
  numeral,
  main,
  views,
};