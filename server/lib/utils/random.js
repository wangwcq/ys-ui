const _ = require('lodash');

const ex = {};
module.exports = ex;

ex.str = (length = 6, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZqwertyuiopasdfghjklzxcvbnm1234567890!@#$%') => {
  const dict = charset.split('');
  return _.map(_.range(length), i => _.get(dict, _.random(0, dict.length - 1))).join('');
};
