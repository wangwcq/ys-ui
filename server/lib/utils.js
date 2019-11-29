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
    let patchItem = {};
    if (_.isArray(patch)) {
      patchItem = _.find(patch, patchItem => _.get(patchItem, key) === _.get(item, key));
    } else {
      patchItem = _.get(patch, _.get(item, key));
    }
    if (patchItem) {
      _.merge(item, patchItem);
    }
  });
  return ret;
};

ex.ensureArray = (obj) => {
  if (_.isArray(obj)) { return obj; }
  return [obj];
};

ex.getMapFromList = (list = [], key = 'key') => {
  const ret = {};
  _.forEach(list, (item) => {
    ret[_.get(item,key)] = item;
  });
  return ret;
};
