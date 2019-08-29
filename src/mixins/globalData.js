let globalData = {};

export default {
  methods: {
    getGlobalData(path, defaultValue) {
      return _.get(globalData, path, defaultValue);
    },
    setGlobalData(key) {
      return (config) => {
        let value = config;
        if (_.isFunction(value)) {
          value = value(this.getGlobalData(key));
        }
        globalData[key] = value;
      };
    },
  },
};