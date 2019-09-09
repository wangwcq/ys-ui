export default {
  mounted() {
    this.fetchData();
  },
  computed: {
    pageTitle() {
      return `删除${this.moduleName}`;
    },
    message() {
      return this.apiMessage || `是否确认删除${this.moduleName}？`;
    },
  },
  methods: {
    async fetchData() {
      const { id } = this;
      const res = await this.withLoading(this.api(`/api/${this.model}/pre-delete/${id}`));
      if (res) {
        this.apiMessage = res.message || null;
      }
    },
    async handleDelete() {
      const { id } = this;
      const res = await this.withLoading(this.api(`/api/${this.model}/delete/${id}`));
      if (!(res && res.code === 0)) {
        this.$message({
          type: 'error',
          message: res.message,
        });
        return;
      }
      this.$message({
        type: 'success',
        message: '删除成功',
      });
      this.$router.push(`${this.moduleUrl}/`);
    },
  },
};