const globalData = window.G || {};

export default {
  methods: {
    G() {
      return globalData;
    },
    getGlobalData(path, defaultValue) {
      return _.get(globalData, path, defaultValue);
    },
    setGlobalData(key) {
      return (input) => {
        let value = input;
        if (_.isFunction(value)) {
          value = value(this.getGlobalData(key));
        }
        globalData[key] = value;
      };
    },
  },
};