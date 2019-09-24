export default {
  methods: {
    async withLoading(asyncFunc) {
      const loading = this.$message({
        type: 'info',
        message: 'Loading...',
        duration: 0,
      });
      let res = null
      try {
        res = await asyncFunc();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('WithLoading Error: ', e);
        this.$message({
          type: 'error',
          message: e.message,
          duration: 1000,
        });
      }
      loading.close();
      return res;
    },
  },
};
