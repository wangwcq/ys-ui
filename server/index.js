const lodash = require('async-dash');
const Koa = require('koa');
const serve = require('koa-static');
const KoaBody = require('koa-body');
const libRequireDir = require('require-dir');
const paths = require('path');
const Router = require('koa-router');

const KoaApp = require('./lib/koa-app');
const Logger = require('./lib/logger');
const consts = require('./lib/consts');

const initDb = require('./lib/initDb/index');
const ensureSeedData = require('./lib/ensureSeedData/index');

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
