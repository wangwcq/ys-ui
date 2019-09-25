export default {
  data() {
    return {
      attributes: [],
      data: null,
      customAttributes: [],
      extendedData: {},
    };
  },
  mounted() {
    this.fetchData();
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
        customAttributes = [],
        extendedData = {},
      } = await this.withLoading(this.api(`/api/${this.model}/edit/${id || ''}`));
      this.attributes = attributes;
      this.data = item;
      this.customAttributes = customAttributes;
      this.extendedData = extendedData;
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
  },
};
