const _ = require('lodash');
const KoaRouter = require('koa-joi-router');
const merge = require('lodash/merge');
const pick = require('lodash/pick');
const get = require('lodash/get');
const map = require('lodash/map');
const zipObject = require('lodash/zipObject');
const keys = require('lodash/keys');
const values = require('lodash/values');
const pickBy = require('lodash/pickBy');
const isFunction = require('lodash/isFunction');
const isObject = require('lodash/isObject');
const Logger = require('./logger');

const { Op } = require('sequelize');

let defaultConfig = {
  model: null,
  enableAllMethods: false,
  crud: {
    definition: true,
    list: true,
    search: true,
    add: true,
    view: true,
    save: true,
    delete: true,
  },
  list: {
    pageSize: 20,
  },
  texts: {
    dataNotFound: 'Data not found',
    dataNotSaved: 'Data not saved',
  },
};

class CRUD {
  constructor(userConfig = {}) {
    const config = merge({}, defaultConfig, userConfig);
    if (!config.model) {
      throw new Error('Error creating CRUD module: Please provide sequelize Model instance');
    }
    if (!config.modelPk) {
      ([config.modelPk] = keys(pickBy(config.model.prototype.rawAttributes, x => x.primaryKey)));
    }
    this.config = config;
    this.router = new KoaRouter();
    this.buildRouter();
  }

  static defaults(userConfig = {}) {
    defaultConfig = merge({}, defaultConfig, userConfig);
  }

  preData() {
    return async (ctx, next) => {
      const request = merge({}, ctx.params, ctx.request.query, ctx.request.body);
      ctx.data = {};
      ctx.data.request = request;
      await next();
    };
  }

  getList(options = {}) {
    const {
      include = [],
    } = options;
    return async (ctx, next) => {
      const logger = Logger('crud');
      try {
        const {
          page = 1,
          fields = null,
        } = ctx.data.request;
        const { config } = this;
        const { model } = config;
        const where = ctx.data.request;
        const list = await model.findAll({
          where,
          // offset: (page - 1) * config.list.pageSize,
          // limit: config.list.pageSize,
          order: [
            ['createdAt', 'desc'],
            ['id', 'desc'],
          ],
          attributes: fields,
          include,
        });

        ctx.data.list = list;
        await next();
      } catch (e) {
        logger.debug && logger.error(e, 'crud getList');
        throw e;
      }
    };
  }

  getSearchList(options = {}) {
    const {
      include = [],
    } = options;
    return async (ctx, next) => {
      const {
        page = 1,
        fields = null,
        limit = 1000,
        ...search
      } = ctx.data.request;
      const { config } = this;
      const { model } = config;
      const where = zipObject(
        keys(search),
        values(search).map((x) => {
          if (_.startsWith(x, 'LIKE_')) return { [Op.like]: `%${x.replace('LIKE_', '').replace(/%/g, '%%')}%` };
          if (_.startsWith(x, 'IS_NOT_NULL_')) return { [Op.not]: null };
          if (_.startsWith(x, 'IS_NULL_')) return { [Op.is]: null };
          return x;
        }),
      );
      const list = await model.findAll({
        where,
        // offset: (page - 1) * config.list.pageSize,
        // limit: config.list.pageSize,
        attributes: fields,
        order: [
          ['createdAt', 'desc'],
        ],
        include,
        limit: Number(limit),
      });
      ctx.data.list = list;
      await next();
    };
  }

  getDefaultData(apiConfig = { enableQueryFill: true }) {
    const { config } = this;
    const { defaultData: configDefaultData, model } = config;
    return async (ctx, next) => {
      const fields = keys(pickBy(model.prototype.rawAttributes, (x => !x.primaryKey)));
      const modelWithStr = zipObject(
        fields,
        fields.map(() => ''),
      );
      let defaultData = modelWithStr;
      if (apiConfig.enableQueryFill) {
        defaultData = merge({}, defaultData, ctx.data.request);
      }
      if (isFunction(configDefaultData)) {
        defaultData = merge({}, defaultData, await configDefaultData({ ctx }));
      } else if (isObject(configDefaultData)) {
        defaultData = merge({}, defaultData, configDefaultData);
      }
      ctx.data.defaultData = defaultData;
      await next();
    };
  }

  okData(fields = ['list'], doFlatten = true) {
    return async (ctx, next) => {
      const data = (doFlatten ? get : pick)(ctx.data, fields);
      ctx.jsonOk(data);
      await next();
    };
  }

  getDefinition() {
    const { model } = this.config;
    return async (ctx, next) => {
      ctx.data.definition = map(model.prototype.rawAttributes, (o, i) => ({
        field: o.field,
        type: o.type.constructor.name,
      }));
      await next();
    };
  }

  getById(options = {}) {
    const {
      include = [],
    } = options;
    const { config } = this;
    const { model } = config;
    return async (ctx, next) => {
      const { id, fields = null } = ctx.data.request;
      const data = await model.findOne({
        where: {
          [config.modelPk]: id,
        },
        attributes: fields,
        include,
      });
      if (!data) {
        ctx.jsonFail(config.texts.dataNotFound);
        return;
      }
      ctx.data.data = data;
      await next();
    };
  }

  saveData() {
    const { config } = this;
    const { model, modelPk } = config;
    return async (ctx, next) => {
      const { request } = ctx.data;
      let data;
      if (request[modelPk]) {
        data = await model.findOne({ where: { [modelPk]: request[modelPk] } });
        if (!data) {
          ctx.jsonFail(config.texts.dataNotFound);
          return;
        }
        try {
          await data.update(request);
        } catch (e) {
          ctx.jsonFail(config.texts.dataNotSaved, e);
          return;
        }
      } else {
        data = await model.create(request);
      }
      ctx.data.model = data;
      ctx.data.saved = data.toJSON();
      await next();
    };
  }

  deleteData() {
    const { config } = this;
    const { model, modelPk } = config;
    return async (ctx, next) => {
      const { id } = ctx.data.request;
      const data = await model.findOne({ where: { [modelPk]: id } });
      if (!data) {
        ctx.jsonFail(config.texts.dataNotFound);
        return;
      }
      await data.destroy();
      await next();
    };
  }

  buildRouter() {
    const { config, router } = this;

    const addRouter = (preferredMethod = 'get') => (...routerConfig) => {
      router[config.enableAllMethods ? ['get', 'post'] : preferredMethod](...routerConfig);
    };

    router.use(this.preData());
    if (config.crud.definition) addRouter('get')('/definition', this.getDefinition(), this.okData('definition'));
    if (config.crud.list) addRouter('get')('/list', this.getList(), this.okData(['list'], true));
    if (config.crud.search) addRouter('get')('/search', this.getSearchList(), this.okData(['list'], true));
    if (config.crud.add) addRouter('get')('/add', this.getDefaultData(), this.okData('defaultData'));
    if (config.crud.view) addRouter('get')('/view/:id', this.preData(), this.getById(), this.okData('data'));
    if (config.crud.save) addRouter('post')('/save', this.saveData(), this.okData('saved'));
    if (config.crud.delete) addRouter('post')('/delete/id/:id', this.preData(), this.deleteData(), this.okData(''));
    return router;
  }

  middleware() {
    const { router } = this;
    return router.middleware();
  }
}

module.exports = CRUD;
