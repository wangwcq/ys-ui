import _ from 'lodash';

let globalData = {};

if (typeof window !== 'undefined') {
  if (window.G) { globalData = window.G; }
  else { window.G = globalData; }
}

export default {
  methods: {
    $get: _.get,
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
