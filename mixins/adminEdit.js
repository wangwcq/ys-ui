import _ from 'lodash';
import { MessageBox } from 'element-ui';

const mixin = {
  props: {
    moduleUrl: { type: String, default: '/' },
    model: { type: String, default: 'data' },
    vId: { type: [Number, String], default: '' },
    idA: { type: [Number, String], default: '' },
    idB: { type: [Number, String], default: '' },
    dataDefault: { type: Object, default: () => ({}) },
    afterSubmit: {
      type: Function,
      default: function(res) {
        let isDecided = false;
        const defaultBehavior = () => {
          this.$router.push(`${this.moduleUrl}/`);
        };

        this.$confirm('请选择下一步操作(3秒后自动返回列表)', '已保存', {
          confirmButtonText: '返回列表',
          cancelButtonText: '继续编辑',
          type: 'success',
          showCancelButton: Boolean(this.id || _.get(res, 'id')),
        }).then(() => {
          if (isDecided) return;
          isDecided = true;
          defaultBehavior();
        }).catch(() => {
          if (isDecided) return;
          isDecided = true;
          if (this.id) {
            this.fetchData(res.id);
          } else if (res.id) {
            this.$router.push(`${this.moduleUrl}/edit/${res.id}`);
          } else {
            defaultBehavior();
          }
        });

        setTimeout(() => {
          if (isDecided) return;
          isDecided = true;
          MessageBox.close();
          defaultBehavior();
        }, 3000);
      },
    },
    lockedFields: { type: Array, default: () => [] },
    readonly: { type: Boolean, default: false },
    compact: { type: Boolean, default: false },
    disableEditLink: { type: Boolean, default: false },
    compactTabs: { type: Boolean, default: false },
  },
  emits: ['after-submit'],
  data() {
    return {
      id: this.getId(),
      attributes: [],
      data: null,
      customFields: null,
      customFieldsData: null,
      subLists: {},
      tab: 'main',
      withCustomFields: true,
    };
  },
  mounted() {
    this.fetchData();
    this.withCustomFields && this.fetchCustomFields();
  },
  methods: {
    getId() {
      if (this.vId) return this.vId;
      if (this.$attrs.id) return this.$attrs.id;
      if (this.idA && this.idB) { return [this.idA, this.idB].join('/'); }
      return '';
    },
    async fetchData(vId) {
      const id = vId || this.id;
      const {
        attributes = [],
        item = {},
      } = await this.withLoading(this.api(`/api/${this.model}/edit/${id || ''}`, { ..._.get(this.$route, 'query', {}) }));

      const lockedFields = [
        ...this.lockedFields || [],
        ..._.keys(_.get(this.$route, 'query', {})),
      ];
      _.forEach(lockedFields, field => {
        const findField = _.find(attributes, item => item.name === field);
        if (!findField) return true;
        _.set(findField, 'readonly', true);
        if (findField.type) {
          if (!_.startsWith(findField.type, 'readonly__')) {
            _.set(findField, 'type', `readonly__${findField.type}`);
          }
        }
        return true;
      });
      this.attributes = attributes;
      this.data = item;
      if (!id) {
        this.data = {
          ...this.data,
          ...this.dataDefault,
        };
      }
    },
    async handleSubmit() {
      const { id } = this;
      const saveRes = await this.withLoading(this.api(`/api/${this.model}/save/${id || ''}`, this.data));
      if (saveRes !== null) {
        this.$message({
          type: 'success',
          message: '保存成功',
        });
        this.afterSubmit(saveRes);
        this.vAfterSubmit(saveRes);
        this.$emit('after-submit');
      }
    },
    vAfterSubmit() {},
    async fetchCustomFields(options = {}) {
      const {
        customFieldsKey = this.model,
        vCustomFieldsKey = 'customFields',
        vCustomFieldsDataKey = 'customFieldsData',
      } = options;
      const {
        id,
      } = this;
      if (!id || !customFieldsKey) return;
      const res = await this.withLoading(this.api(`/api/${this.model}/custom-fields/${customFieldsKey}/${id}`));
      const { fields, data } = res || {};
      if (fields && data) {
        this[vCustomFieldsKey] = fields;
        this[vCustomFieldsDataKey] = data;
      }
    },
  },
};

/**
 * util createWith
 * @param options
 * @param {Object} options.component
 * @param {string} options.moduleUrl
 * @param {string} options.model
 * @param {string} options.buttonText
 * @param {Object} options.dataDefault
 * @param {Array} options.lockedFields
 */
mixin.createWith = (options = {}) => options;

/**
 * util sublist
 * @param {Object} options
 * @param {string} options.model
 * @param {string} options.id
 * @param {string} options.targetModel
 * @param {Object} options.ComponentEditWith
 * @param {string} options.buttonText
 * @param {string} options.idField
 * @param {Array} options.lockedFields
 * @param {Boolean} options.noCreate
 * @param {Array} options.hiddenColumns
 * @param {Boolean} options.disableEditLink
 * @param {Boolean} options.expandable
 */
mixin.sublist = (options = {}, custom = {}) => {
  const {
    model = '',
    id = '',
    targetModel = '',
    ComponentEditWith = null,
    buttonText = '添加相关数据',
    idField = '',
    lockedFields = [],
    noCreate = false,
    hiddenColumns = [],
    disableEditLink = false,
    expandable = true,
    createParams = {},
    editIdField = 'id',
  } = options;
  return _.merge({}, {
    url: `/api/${model}/sub-list/${targetModel}/${id}`,
    model: targetModel,
    moduleUrl: `/${targetModel}`,
    editWith: ComponentEditWith,
    editIdField,
    createWith: {
      component: ComponentEditWith,
      dataDefault: {
        [idField]: Number(id),
      },
      lockedFields,
      model: targetModel,
      moduleUrl: `/${targetModel}`,
      createParams,
      buttonText,
    },
    noCreate,
    hiddenColumns,
    disableEditLink,
    expandable,
  }, custom);
};

export default mixin;
