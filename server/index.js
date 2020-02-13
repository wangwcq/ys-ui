const lodash = require('async-dash');
const Koa = require('koa');
const serve = require('koa-static');
const KoaBody = require('koa-body');
const libRequireDir = require('require-dir');
const paths = require('path');
const proxy = require('koa-proxies');
const Router = require('koa-router');
const moment = require('moment');
const axios = require('axios');

const KoaApp = require('./lib/koa-app');
const Logger = require('./lib/logger');
const consts = require('./lib/consts');

const initDb = require('./lib/initDb/index');
const ensureSeedData = require('./lib/ensureSeedData/index');
const useCustomFields = require('./lib/useCustomFields/index');
const useSubList = require('./lib/useSubList/index');
const useComments = require('./lib/useComments/index');

const utils = require('./lib/utils');

/**
 * @typedef {Object} ServerConfig
 * @property {Function} [routers = () => {}]
 *
 * @param {ServerConfig} config
 * @returns {Promise<void>}
 */
const main = async (config = {}) => {
  const {
    routers = () => {},
    ...appConfig
  } = config;
  const app = new KoaApp(appConfig);
  routers(app.router);
  await app.serverStartup();

  app.app.use(app.koaHistory);
  app.app.use(serve('./dist'));
  app.app.use(serve('./files'));

  app.serve();
};

const requireDir = (
  baseDir = '.',
) => {
  console.log('requiredir, basedir', baseDir);
  return libRequireDir(baseDir, { recurse: true });
};

module.exports = {
  main,
  Logger,
  requireDir,
  lodash,
  axios,
  _: lodash,
  utils,
  Router,
  consts,

  initDb,
  ensureSeedData,

  useCustomFields,
  useSubList,
  useComments,

  moment
};
