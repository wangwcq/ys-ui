import _ from 'lodash';

export default {
  data() {
    return {
      user: null,
    };
  },
  mounted() {
    this.checkLoggedIn();
  },
  methods: {
    async checkLoggedIn() {
      const res = await this.withLoading(this.api('/api/whoami'));
      if (!res) {
        this.$router.replace('/admin/login');
        return;
      }
      this.user = res;
      if (_.isFunction(this.handleLogin)) {
        this.handleLogin(res);
      }
    },
  },
};
