export default {
  methods: {
    api(api, data, config) {
      return async () => {
        const {
          method = 'POST',
          error,
          defaultValue = null,
        } = config;
        let res = null;
        try {
          if (method.toUpperCase() === 'GET') {
            res = await axios.get(api, {
              params: data,
            });
          } else {
            res = await axios.post(api, data);
          }
          res = res.data;
          if (res.code !== 0) throw new Error(res.message);
          return res.data;
        } catch(e) {
          this.$message({ message: e.message, type: "error" });
          if (_.isFunction(error)) {
            await error(e);
          }
          return defaultValue;
        }
      };
    },
  },
};