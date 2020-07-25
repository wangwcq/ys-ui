const lodash = require('async-dash');
const Sequelize = require('sequelize');
const fs = require('fs-extra');
const serve = require('koa-static');
const libRequireDir = require('require-dir');
const Router = require('koa-router');
const moment = require('moment');
const multer = require('@koa/multer');
const numeral = require('numeral');
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
 * @param {Object} config
 * @param {function} config.routers
 * @param {string} config.appName
 * @param {string} config.port
 * @param {string} config.apiBase
 * @param {boolean} config.useHelloWorld
 * @param {boolean} config.useDebugger
 * @param {boolean} config.debug
 * @param {string} config.logKey
 * @param {string} config.logsDir
 * @param {function} config.serverStartup
 * @param {string[]} config.historyApiFallbackWhitlist
 * @returns {Promise<void>}
 */
const main = async (config = {}) => {
  const { routers = () => {}, ...appConfig } = config;
  const app = new KoaApp(appConfig);
  await app.serverStartup();

  await fs.ensureDir('files/files/');
  const uploader = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'files/files/');
      },
      filename: function (req, file, cb) {
        let ext;
        ext = file.originalname;
        ext = lodash.last(String(ext || '').split('/') || []) || '';
        ext = lodash.last(String(ext || '').split('.') || []) || '';
        if (ext) {
          ext = `.${ext}`;
        }
        cb(null, file.fieldname + '-' + Date.now() + ext);
      },
    }),
  });

  app.router.post('/upload', uploader.single('file'), async (ctx) => {
    ctx.jsonOk({
      ...ctx.file,
      url: `/files/${ctx.file.filename}`,
    });
  });

  routers(app.router);

  app.app.use(app.koaHistory);
  app.app.use(serve('./dist', {
    maxage: 4 * 3600000,
    defer: true,
    gzip: true,
  }));
  app.app.use(serve('./files', {
    maxage: 30 * 24 * 3600000,
    defer: true,
    gzip: true,
  }));

  app.serve();
};

const requireDir = (baseDir = '.') => {
  console.log('requiredir, basedir', baseDir);
  return libRequireDir(baseDir, { recurse: true });
};

module.exports = {
  main,
  Logger,
  requireDir,
  lodash,
  _: lodash,
  axios,
  numeral,
  moment,
  utils,
  Router,
  consts,
  Sequelize,

  initDb,
  ensureSeedData,

  useCustomFields,
  useSubList,
  useComments,
};
