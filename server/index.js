const lodash = require('lodash');
const Koa = require('koa');
const KoaBody = require('koa-body');
const libRequireDir = require('require-dir');
const paths = require('path');
const Router = require('koa-router');

const KoaApp = require('./lib/koa-app');
const Logger = require('./lib/logger');
const initDb = require('./lib/initDb/index');

const main = async (config = {}) => {
  const {
    routers = () => {},
    ...appConfig
  } = config;
  const app = new KoaApp(appConfig);
  routers(app.router);
  await app.serverStartup();
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
  initDb,
  lodash,
  _: lodash,
  Router,
};
