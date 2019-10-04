export default {
  props: {
    moduleName: { type: String, default: '模块' },
    moduleUrl: { type: String, default: '/' },
    model: { type: String, default: 'data' },
    pageTitle: { type: String, default: '欢迎' },
  },
  data() {
    return {
      data: null,
      attributes: null,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const res = await this.withLoading(this.api(`/api/${this.model}/list`));
      if (!res) {
        this.$message({
          type: 'error',
          message: '无法加载列表',
        });
        return;
      }
      const { attributes, list } = res;
      this.attributes = attributes;
      this.data = list;
    },
  },
};
