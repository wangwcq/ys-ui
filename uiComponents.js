/* eslint-disable */
import mVue from 'vue';
import _ from 'lodash';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './utils.less';

import UiFlex from './components/UiFlex';
import UiPageHeader from './components/UiPageHeader';
import UiMediaBox from './components/UiMediaBox';
import UiPlaceholder from './components/UiPlaceholder';
import UiDatetimePicker from "./components/UiDatetimePicker";
import UiContainer from './components/UiContainer';
import UiStage from './components/UiStage';
import UiAdminTable from "./components/UiAdminTable";
import UiAdminForm from './components/UiAdminForm';
import UiSubList from './components/UiSubList';
import UiDataSelect from './components/UiDataSelect';
import UiLogo from './components/UiLogo';

/**
 * @typedef {Object} ContainerConfig
 * @property {string} [maxWidth = '1100px']
 *
 * @typedef {Object} ComponentConfigCommon
 * @property {string} [appName = 'Builder']
 * @property {string} [appLogo = '']
 *
 * @typedef {Object} ComponentsConfig
 * @property {ComponentConfigCommon} common
 * @property {ContainerConfig} container
 */

/**
 * @param iVue
 * @param {Object} options
 * @param {ComponentsConfig} options.componentsConfig
 */
export default (iVue, options = {}) => {
  const {
    componentsConfig = {},
  } = options;
  const Vue = iVue || mVue;

  Vue.prototype.$componentsConfig = componentsConfig;
  Vue.mixin({
    methods: {
      $getComponentConfig(componentName, propName) {
        return _.get(componentsConfig, [componentName, propName]);
      },
    },
  });

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
  Vue.component('ui-container', UiContainer);
  Vue.component('ui-flex', UiFlex);
  Vue.component('ui-admin-table', UiAdminTable);
  Vue.component('ui-admin-form', UiAdminForm);
  Vue.component('ui-data-select', UiDataSelect);
  Vue.component('ui-sub-list', UiSubList);
  Vue.component('ui-datetime-picker', UiDatetimePicker);
  Vue.component('ui-logo', UiLogo);
};
