const numeral = require('numeral');
const moment = require('moment');
const utilsRandom = require('./utils/random');

const _ = require('lodash');
const md5 = require('md5');

const errors = {
  NOT_A_FUNCTION: 'Please input a function!',
};

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

ex.encodePassword = (password, method = 'md5') => {
  let ret = password;
  if (method === 'md5') {
    ret = md5(password);
  }
  return ret;
};

ex.formatPrice = (value, format = '0,0.00') => numeral(value).format(format);

ex.formatDateTime = (value, format = 'YYYY-MM-DD HH:mm:ss') => moment(value).format(format);

ex.containsText = (text, keyword) => {
  return String(text).toLowerCase().indexOf(String(keyword).toLowerCase()) !== -1;
};

ex.flattenedValues = (obj) => {
  if (typeof obj !== "object") { return obj; }
  return _.flattenDeep(_.map(obj, item => flattenedValues(item)));
};

ex.random = utilsRandom;

ex.withTry = async (fn, ...params) => {
  try {
    if (!_.isFunction(fn)) throw new Error(errors.NOT_A_FUNCTION);
    const res = await fn(...params);
    return res;
  } catch(e) {
    console.error(e);
    return null;
  }
};
