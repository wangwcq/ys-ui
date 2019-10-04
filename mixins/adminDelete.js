export default {
  props: {
    moduleName: { type: String, default: '模块' },
    moduleUrl: { type: String, default: '/' },
    model: { type: String, default: 'data' },
    pageTitle: { type: String, default: '欢迎' },
    id: { type: [Number, String], default: '' },
  },
  data() {
    return {
      apiMessage: '',
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
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
