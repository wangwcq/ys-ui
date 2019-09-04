/* eslint-disable no-console */
const _ = require('lodash');
const merge = require('lodash/merge');
const requireDir = require('require-dir');
const Koa = require('koa');
const KoaRouter = require('koa-joi-router');
const koaBody = require('koa-body');
const koaSession = require('koa-session');
const { historyApiFallback } = require('koa2-connect-history-api-fallback');
const Raven = require('raven');
const chalk = require('chalk');
const Logger = require('./logger');
const uuidv1 = require('uuid');
const fs = require('fs-extra');
const readLastLines = require('read-last-lines');
const paths = require('path');
const swagger = require('./swagger');

const { Joi } = swagger;

let requests = 0;

let logger = Logger('server');

const defaultConfig = {
  appName: 'MyAPP',
  port: '8001', // Since vue-cli projects host on port 8000 by default
  apiBase: '/api',
  useHelloWorld: true,
  useDebugger: true,
  debug: false,
  logKey: 'server',
  logsDir: paths.resolve('./.logs'),
  serverStartup: () => {},
  historyApiFallbackWhitelist: [],
};

class App {
  constructor(userConfig = {}) {
    const config = merge({}, defaultConfig, userConfig);

    const app = new Koa();

    Logger.init({ app });
    logger = Logger(config.logKey);

    // Add sentry monitor
    if (config.sentryDsn) {
      Raven.config(config.sentryDsn).install();
      app.on('error', (err) => {
        Raven.captureException(err, (err, eventId) => {
          console.error(err);
          console.log(`Reported error ${eventId}`);
        });
      });
      console.log('Sentry config OK.');
    }

    app.keys = [config.appName];

    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (e) {
        console.error(e);
        ctx.jsonFail(e.message, undefined, 200);
      }
    });

    app.use(async (ctx, next) => {
      if (!app.debug || _.startsWith(ctx.req.url, '/api/logs/')) {
        await next();
        return;
      }
      ctx.requestUUID = uuidv1();
      ctx.startTime = Date.now();
      logger.info(ctx.req, `Route Input ${ctx.requestUUID}`);
      requests += 1;
      await next();
      requests -= 1;
      const time = Date.now() - ctx.startTime;
      logger.info({
        statusCode: ctx.res.statusCode,
        body: ctx.body,
      }, `Route Output ${ctx.requestUUID} ${ctx.req.url} +${time}ms ${requests} connections active`);
    });

    app.use(koaBody());
    app.use(koaSession({ key: config.appName }, app));
    const router = new KoaRouter();
    router.prefix(config.apiBase);
    if (config.useHelloWorld) {
      router.route({
        path: '/',
        method: 'get',
        swagger: {
          summary: 'Hello world',
          responses: {
            200: {
              description: 'Success',
              schema: swagger.schemas.jsonRes(Joi.string()),
            },
          },
        },
        handler: (ctx) => {
          ctx.status = 200;
          ctx.body = {
            code: 0,
            data: `Hello ${config.appName}`,
          };
        },
      });
    }

    if (config.useDebugger) {
      router.route({
        path: '/logs/debug/:value',
        method: ['get'],
        validate: {
          params: {
            value: Joi.number().valid(0, 1),
          },
        },
        swagger: {
          summary: 'Toggle debug mode',
          description: 'Should open debug mode. \n\nWhen debug mode is open, all server requests and logs will be printed to a temp file. \n\nWhen debug mode is turned off, the logs file will be removed. ',
          tags: ['Debug'],
          responses: swagger.schemas.commonRes({
            200: {
              description: 'Success',
              schema: swagger.schemas.jsonRes(),
            },
          }),
        },
        handler: async (ctx) => {
          const value = Number(ctx.params.value);
          if (value) {
            app.debug = true;
            Logger.init({
              dest: config.logsDir,
            });
            logger = Logger(config.logKey);
            logger.info('Server Debugger on');
            console.log('Server Debugger on');
          } else {
            Logger.init({ dest: null });
            logger = Logger(config.logKey);
            await fs.remove(config.logsDir);
            app.debug = false;
            console.log('Server Debugger off');
          }
          app.context.logger = logger;
          ctx.jsonOk();
        },
      });

      router.route({
        path: '/logs/logs/:lines',
        method: 'get',
        validate: {
          params: {
            lines: Joi.number().integer().min(1).max(100)
              .description('Lines to query'),
          },
        },
        swagger: {
          tags: ['Debug'],
          summary: 'Get server latest temp debug logs by lines',
          responses: {
            200: {
              description: 'Success',
              schema: swagger.schemas.jsonRes(Joi.array().items(Joi.object().description('Server log by pino').example({
                level: 30,
                time: 1559816497869,
                pid: 25733,
                hostname: 'wangchaoqis-MacBook-Pro.local',
                name: 'server',
                msg: 'Server Debugger on',
                v: 1,
              }))),
            },
          },
        },
        handler: async (ctx) => {
          try {
            const loggerStr = await readLastLines.read(config.logsDir, ctx.params.lines || 10);
            ctx.jsonOk(loggerStr.split('\n').map(x => x && JSON.parse(x)).filter(Boolean));
          } catch (e) {
            ctx.jsonFail(e.message);
          }
        },
      });

      router.route({
        path: '/logs/restart',
        method: 'get',
        swagger: {
          tags: ['Debug'],
          summary: 'Soft restart all external service connections',
          description: 'Useful when debug mode is on. Connection configs will be logged in file. Remember to remove the temp debug log file after debugging.',
          responses: {
            200: {
              description: 'Success',
              schema: swagger.schemas.jsonRes(),
            },
          },
        },
        handler: async (ctx) => {
          try {
            await this.serverStartup();
            ctx.jsonOk();
          } catch (e) {
            ctx.jsonFail(e.message);
          }
        },
      });
    }

    app.context.logger = logger;
    app.context.jsonOk = function (data) {
      this.status = 200;
      this.body = {
        code: 0,
        data,
      };
    };
    app.context.jsonFail = function (message, data, statusCode = 200) {
      this.status = statusCode;
      this.body = {
        code: 1,
        message,
        data,
      };
    };

    console.log(paths.resolve('./server/services'));
    app.context.services = requireDir(paths.resolve('./server/services'), { recurse: true });

    this.config = config;
    this.app = app;
    this.router = router;

    this.koaHistory = historyApiFallback({
      whiteList: [
        this.config.apiBase,
        ...this.config.historyApiFallbackWhitelist,
      ],
    });
  }

  async serverStartup() {
    const { config } = this;
    if (_.isFunction(config.serverStartup)) {
      await config.serverStartup();
    }
  }

  async serve() {
    const { app, router, config } = this;

    app.use(router.middleware());
    swagger.add(app, config.apiBase);

    app.listen(config.port);
    console.log(chalk.bgBlue.black.bold(`${config.appName} Server started on port ${config.port}`));
  }
}

module.exports = App;
