import _ from 'lodash';

export default {
  props: {
    moduleUrl: { type: String, default: '/' },
    model: { type: String, default: 'data' },
    url: { type: String, default: undefined },
    apiBody: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      data: null,
      attributes: null,
    };
  },
  computed: {
    vApi() {
      if (this.vvApi) return this.vvApi;
      if (!_.isUndefined(this.url)) return this.url;
      return `/api/${this.model}/list`;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const res = await this.withLoading(this.api(this.vApi, this.apiBody));
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
