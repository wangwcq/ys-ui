/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { SwaggerAPI, ui } = require('koa-swagger-ui');
const koaRouter = require('koa-joi-router');

const { Joi } = koaRouter;

const swaggerAPI = new SwaggerAPI();

module.exports = swaggerAPI;

module.exports.ui = ui;

module.exports.Joi = Joi;

module.exports.add = (router, prefix, parent) => {
  if (!router.swagger) {
    router.swagger = {};
  }
  router.swagger.prefix = prefix;
  if (!parent) {
    return;
  }
  if (!parent.swagger) {
    parent.swagger = {};
  }
  if (!parent.swagger.children) {
    parent.swagger.children = [];
  }
  parent.swagger.children.push(router);
};

module.exports.addAll = (router, parentPrefix = '') => {
  const prefix = `${parentPrefix}${_.get(router, 'swagger.prefix') || ''}`;
  swaggerAPI.addJoiRouter(router, {
    prefix,
  });
  console.log('Add swagger document: ', prefix);
  if (_.get(router, 'swagger.children')) {
    router.swagger.children.forEach((x) => {
      module.exports.addAll(x, prefix);
    });
  }
};

const S = module.exports.schemas = {};

S.jsonRes = (
  data = undefined,
  code = 0,
  message = undefined,
) => Joi.object({
  code: Joi.number().valid(code).description('Response code, 0 is success, 1 is failures'),
  ...(message ? { message } : {}),
  ...(data ? { data } : {}),
});

S.commonRes = (responses = {}) => ({
  ...responses,
  401: {
    description: 'Unauthenticated',
    schema: S.jsonRes(undefined, 1, Joi.string().description('Error message').example('Unauthenticated')),
  },
  403: {
    description: 'Unauthorized',
    schema: S.jsonRes(undefined, 1, Joi.string().description('Error message').example('Unauthorized')),
  },
});

