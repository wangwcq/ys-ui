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
import UiUploads from "./components/UiUploads";
import UiSubList from './components/UiSubList';
import UiDataSelect from './components/UiDataSelect';
import UiLogo from './components/UiLogo';
import UiWithErrorView from './components/UiWithErrorView';
import UiChangePassword from './components/UiChangePassword';

/**
 * @typedef {Object} ContainerConfig
 * @property {string} [maxWidth = '1100px']
 *
 * @typedef {Object} ComponentConfigCommon
 * @property {string} [appName = 'Builder']
 * @property {string} [appLogo = '']
 *
 * @typedef {Object} AdminModelPickerConfig
 * @property {function} getApi
 *
 * @typedef {Object} ComponentsConfig
 * @property {ComponentConfigCommon} common
 * @property {ContainerConfig} container
 * @property {AdminModelPickerConfig} adminModelPicker
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

  Vue.prototype.$componentsConfig = _.merge({}, {
    common: {
      appName: 'Builder',
      appLogo: '',
      owner: '上海熠世信息技术有限公司',
      powerBy: '上海熠世信息技术有限公司',
      moduleUrlBase: '',
    },
    container: {
      maxWidth: '1100px',
    },
    adminModelPicker: {
      getApi: (apiName) => {
        return `/api/${_.kebabCase(apiName)}/list`;
      },
    },
  }, componentsConfig);

  Vue.mixin({
    methods: {
      $getComponentConfig(componentName, propName) {
        return _.get(this.$componentsConfig, [componentName, propName]);
      },
    },
  });
  console.log('init mixin');

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
  Vue.component('ui-uploads', UiUploads);
  Vue.component('ui-data-select', UiDataSelect);
  Vue.component('ui-sub-list', UiSubList);
  Vue.component('ui-datetime-picker', UiDatetimePicker);
  Vue.component('ui-logo', UiLogo);
  Vue.component('ui-with-error-view', UiWithErrorView);
  Vue.component('ui-change-password', UiChangePassword);
};
