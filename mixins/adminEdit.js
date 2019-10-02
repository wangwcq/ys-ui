export default {
  data() {
    const {
      moduleName,
      model,
      moduleUrl,
    } = this.$route.meta;
    const {
      id,
    } = this.$route.params;
    return {
      model,
      moduleName,
      moduleUrl,
      id,
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
  computed: {
    pageTitle() {
      return `${this.id ? '编辑' : '创建'}${this.moduleName}信息`;
    },
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
    },
    async handleSubmit() {
      const { id } = this;
      await this.withLoading(this.api(`/api/${this.model}/save/${id || ''}`, this.data));
      this.$message({
        type: 'success',
        message: '保存成功',
      });
      this.$router.push(`${this.moduleUrl}/`);
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
      const { fields, data } = await this.withLoading(this.api(`/api/${this.model}/custom-fields/${customFieldsKey}/${id}`));
      if (fields && data) {
        this[vCustomFieldsKey] = fields;
        this[vCustomFieldsDataKey] = data;
      }
    },
    async fetchSubList(subListName = '', subListModel = {}) {
      try {
        if (!subListName) throw new Error('无法获取子订单');
        const res = await this.withLoading(this.api(`/api/${this.model}/sub-list/${subListName}/${this.id}`));
        if (!res) {
          this.$message({
            type: 'error',
            message: '无法加载列表',
          });
          return;
        }
        const { attributes, list } = res;
        this.$set(subListModel, 'attributes', attributes);
        this.$set(subListModel, 'list', list);
      } catch(e) {
        this.$message({
          type: 'error',
          message: e.message,
        });
      }
    },
  },
};
