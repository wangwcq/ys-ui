export default {
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