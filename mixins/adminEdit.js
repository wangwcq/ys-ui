export default {
  mounted() {
    this.fetchData();
  },
  computed: {
    pageTitle() {
      return `${this.id ? '编辑' : '创建'}${this.moduleTitle}信息`;
    },
  },
  methods: {
    async fetchData() {
      const { id } = this;
      const { attributes, item } = await this.withLoading(this.api(`/api/${this.model}/edit/${id || ''}`));
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
  },
};