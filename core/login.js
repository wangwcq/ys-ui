export default {
  data() {
    return {
      login: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    async handleSubmit() {
      const loginRes = await this.withLoading(this.api('/api/login', this.login));
      if (loginRes) {
        this.$router.push('/admin/');
      }
    },
  },
};
