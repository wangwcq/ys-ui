const _ = require('lodash');
const pino = require('pino');

let loggerConfig = {
  dest: null,
  app: null,
};

module.exports = (name, config) => {
  const vConfig = _.merge({
    dest: null,
    respectAppDebug: true,
  }, config);
  let pinoDestination = undefined;
  if (vConfig.dest) {
    pinoDestination = pino.destination(vConfig.dest);
  } else if (loggerConfig.dest) {
    pinoDestination = pino.destination(loggerConfig.dest);
  }

  const ret = pino({
    name,
    prettyPrint: {
      translateTime: 'SYS:standard',
    },
    ...(pinoDestination ? {
      prettyPrint: false,
    } : {}),
  }, pinoDestination);
  ret.debug = true;
  if (vConfig.respectAppDebug) {
    if (loggerConfig.app && !loggerConfig.app.debug) {
      ret.debug = false;
    }
  }
  return ret;
};

module.exports.init = (config = {}) => {
  const vConfig = _.merge({}, loggerConfig, config);
  loggerConfig = vConfig;
};
