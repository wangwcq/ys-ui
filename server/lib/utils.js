const _ = require('lodash');

const ex = {};
module.exports = ex;

ex.safeParseJson = (jsonStr = '', defaultRes = {}) => {
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    return defaultRes;
  }
};

ex.patchListByKey = (list = [], patch = {}, key = 'key') => {
  const ret = list;
  _.forEach(list, (item, index) => {
    const patchItem = _.get(patch, _.get(item, key));
    if (patchItem) {
      _.extend(item, patchItem);
    }
  });
  return ret;
};
