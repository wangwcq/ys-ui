const ex = {};
module.exports = ex;

ex.safeParseJson = (jsonStr = '', defaultRes = {}) => {
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    return defaultRes;
  }
};
