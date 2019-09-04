export default {
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const { attributes, list } = await this.withLoading(this.api(`/api/${this.model}/list`));
      this.attributes = attributes;
      this.data = list;
    },
  },
};