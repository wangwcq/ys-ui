import _ from 'lodash';

export default {
  methods: {
    async logout() {
      try {
        if (_.isFunction(this.beforeLogout)) {
          await this.beforeLogout();
        }
        await this.withLoading(this.api('/api/logout'));
      } catch(e) {
        console.log(e.message);
      }
      this.$router.push('/admin/login');
    },
  },
};
