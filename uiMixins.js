import mVue from 'vue';
import mixinWithLoading from './mixins/withLoading';
import mixinHandleRes from './mixins/handleRes';
import mixinGlobalData from './mixins/globalData';

export default (iVue) => {
  const Vue = iVue || mVue;
  Vue.mixin(mixinWithLoading);
  Vue.mixin(mixinHandleRes);
  Vue.mixin(mixinGlobalData);
};
