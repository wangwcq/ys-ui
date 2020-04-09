import _ from 'lodash';
import axios from 'axios';

export default {
  methods: {
    api(api, data, config = {}) {
      return async () => {
        const {
          method = 'POST',
          error,
          defaultValue = null,
          withMessage = true,
          headers = {},
        } = config;
        let res = null;
        try {
          if (method.toUpperCase() === 'GET') {
            res = await axios.get(api, {
              params: data,
              headers,
            });
          } else {
            res = await axios.post(api, data, {
              headers,
            });
          }
          res = res.data;
          if (res.code !== 0) throw new Error(res.message);
          return res.data;
        } catch(e) {
          if (withMessage) {
            this.$message({ message: e.message, type: "error" });
          }
          if (_.isFunction(error)) {
            await error(e);
          }
          return defaultValue;
        }
      };
    },
  },
};
