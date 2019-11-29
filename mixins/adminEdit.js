import _ from 'lodash';

const mixin = {
  props: {
    moduleUrl: { type: String, default: '/' },
    model: { type: String, default: 'data' },
    id: { type: [Number, String], default: '' },
    dataDefault: { type: Object, default: () => ({}) },
    afterSubmit: {
      type: Function,
      default: function() {
        this.$router.push(`${this.moduleUrl}/`);
      },
    },
  },
  emits: ['after-submit'],
  data() {
    return {
      attributes: [],
      data: null,
      customFields: null,
      customFieldsData: null,
      subLists: {},
    };
  },
  mounted() {
    this.fetchData();
    this.fetchCustomFields();
  },
  methods: {
    async fetchData() {
      const { id } = this;
      const {
        attributes = [],
        item = {},
      } = await this.withLoading(this.api(`/api/${this.model}/edit/${id || ''}`));
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
        this.afterSubmit();
        this.$emit('after-submit');
      }
    },
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
 * @param {Boolean} options.noCreate
 */
mixin.sublist = (options = {}, custom = {}) => {
  const {
    model = '',
    id = '',
    targetModel = '',
    ComponentEditWith = null,
    buttonText = '添加相关数据',
    idField = '',
    noCreate = false,
  } = options;
  return _.merge({}, {
    url: `/api/${model}/sub-list/${targetModel}/${id}`,
    model: targetModel,
    moduleUrl: `/${targetModel}`,
    editWith: ComponentEditWith,
    createWith: {
      component: ComponentEditWith,
      dataDefault: {
        [idField]: Number(id),
      },
      model: targetModel,
      moduleUrl: `/${targetModel}`,
      buttonText,
    },
    noCreate,
  }, custom);
};

export default mixin;
