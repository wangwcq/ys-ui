const lodash = require('async-dash');
const Sequelize = require('sequelize');
const fs = require('fs-extra');
const Koa = require('koa');
const serve = require('koa-static');
const libRequireDir = require('require-dir');
const Router = require('koa-router');
const moment = require('moment');
const multer = require('@koa/multer');
const numeral = require('numeral');
const axios = require('axios');
const fastq = require('fastq');
const SocketIO = require('socket.io');

const KoaApp = require('./lib/koa-app');
const Logger = require('./lib/logger');
const consts = require('./lib/consts');

const initDb = require('./lib/initDb/index');
const ensureSeedData = require('./lib/ensureSeedData/index');
const useCustomFields = require('./lib/useCustomFields/index');
const useSubList = require('./lib/useSubList/index');
const useComments = require('./lib/useComments/index');

const utils = require('./lib/utils');

const handler = async (fn, cb) => {
  try {
    if (lodash.isFunction(fn)) {
      const res = await fn();
      cb(null, res);
      return;
    }
    cb(null, fn);
  } catch (e) {
    cb(e);
  }
};
const globalQueue = fastq(handler, 1);
const queue = (fn, q = globalQueue) => {
  console.log('add queue', q.length());
  return async (...params) => {
    const res = await new Promise((resolve, reject) => {
      q.push(
        async () => {
          if (lodash.isFunction(fn)) {
            const res = await fn(...params);
            return res;
          }
          return fn;
        },
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        },
      );
    });
    return res;
  };
};

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
      destination: function(req, file, cb) {
        cb(null, 'files/files/');
      },
      filename: function(req, file, cb) {
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

  app.router.post('/upload', queue(uploader.single('file')), async ctx => {
    ctx.jsonOk({
      ...lodash.pick(ctx.file, [
        'encoding',
        'filename',
        'mimetype',
        'originalname',
        'size',
      ]),
      url: `/files/${ctx.file.filename}`,
    });
  });

  routers(app.router, {
    uploader,
    app: app.app,
    io: app.io,
    unparsed: app.app,
  });

  app.app.use(app.koaHistory);
  app.app.use(
    serve('./dist', {
      maxage: 4 * 3600000,
      defer: true,
      gzip: true,
    }),
  );
  app.app.use(
    serve('./files', {
      maxage: 30 * 24 * 3600000,
      defer: true,
      gzip: true,
    }),
  );

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
  fs,
  lodash,
  _: lodash,
  axios,
  numeral,
  moment,
  fastq,
  queue,
  utils,
  Router,
  consts,
  multer,
  Sequelize,
  Koa,
  SocketIO,

  initDb,
  ensureSeedData,

  useCustomFields,
  useSubList,
  useComments,
};
