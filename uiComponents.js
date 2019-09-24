/* eslint-disable */
import mVue from 'vue';
import _ from 'lodash';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import UiFlex from './components/UiFlex';
import UiPageHeader from './components/UiPageHeader';
import UiMediaBox from './components/UiMediaBox';
import UiPlaceholder from './components/UiPlaceholder';
import UiStage from './components/UiStage';
import UiAdminTable from "./components/UiAdminTable";
import UiAdminForm from './components/UiAdminForm';

import './utils.less';

export default (iVue) => {
  const Vue = iVue || mVue;
  Vue.use(ElementUI);

  _.forEach(ElementUI, (item, name) => {
    if (typeof item === 'object') {
      Vue.component(`Ui${name}`, item);
    }
  });

  Vue.component('ui-page-header', UiPageHeader);
  Vue.component('ui-media-box', UiMediaBox);
  Vue.component('ui-placeholder', UiPlaceholder);
  Vue.component('ui-stage', UiStage);
  Vue.component('ui-flex', UiFlex);
  Vue.component('ui-admin-table', UiAdminTable);
  Vue.component('ui-admin-form', UiAdminForm);
};
