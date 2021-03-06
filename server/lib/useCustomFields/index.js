const _ = require('lodash');
const KoaRouter = require('koa-router');
const consts = require('../consts');
const utils = require('../utils');

const errorPrefix = 'Error useCustomFields:';
const errorPrefixFrontEnd = '无法获取自定义字段：';

module.exports = function(options = {}) {
  const {
    // required
    router = null,
    key = '',
    modelName = null,

    // optional
    modelCustomFields = null,
    modelCustomFieldsData = null,
  } = options;

  let CustomFields = null;
  let CustomFieldsData = null;

  if (!router) throw new Error(`${errorPrefix} Please pass in router!`);
  if (!modelName) throw new Error(`${errorPrefix} Please input model name!`);

  const routerCustomFields = new KoaRouter();

  routerCustomFields.use(async (ctx, next) => {
    const { db } = consts;
    if (!db) throw new Error(`${errorPrefix} Please init db!`);
    CustomFields = modelCustomFields;
    if (!CustomFields) CustomFields = _.get(db, 'models.CustomFields', null);
    if (!CustomFields) throw new Error(`${errorPrefix} Please init CustomFields model!`);

    CustomFieldsData = modelCustomFieldsData;
    if (!CustomFieldsData) CustomFieldsData = _.get(db, 'models.CustomFieldsData', null);
    if (!CustomFieldsData) throw new Error(`${errorPrefix} Please init CustomFieldsData model!`);

    await next();
  });

  const routeCustomFields = async (ctx) => {
    let { key = '', id = null, id1 = null, id2 = null } = ctx.params;
    if (!id && id1 && id2) { id = `${id1}/${id2}`; }
    if (!id) throw new Error(`${errorPrefixFrontEnd} 请输入正确的数据ID`);

    let fields = await CustomFields.findOne({
      where: {
        key,
      },
      order: [
        ['id', 'desc'],
      ],
    });
    fields = _.get(fields, 'fields');
    fields = utils.safeParseJson(fields, []);

    let data = await CustomFieldsData.findOne({
      where: {
        // key,
        model: modelName,
        modelId: id,
      },
    });
    data = _.get(data, 'data', {});
    data = utils.safeParseJson(data, {});

    ctx.jsonOk({
      fields,
      data,
    });
  };

  const routeCustomFieldsSave = async (ctx) => {
    console.log({ params: ctx.params });
    let { key = '', id = '', id1 = null, id2 = null } = ctx.params;
    if (!id && id1) {
      id = id1;
    }
    if (!id && id1 && id2) { id = `${id1}/${id2}`; }

    const body = ctx.request.body;
    if (!id) throw new Error(`${errorPrefixFrontEnd} 请输入正确的数据ID`);

    console.log({ modelName, id });

    const [item] = await CustomFieldsData.findOrCreate({
      where: {
        // key,
        model: modelName,
        modelId: id,
      },
      defaults: {
        key,
        model: modelName,
        modelId: id,
      },
    });

    await item.update({
      key,
      data: JSON.stringify({
        ...body || {},
      }),
    });

    ctx.jsonOk();
  };

  routerCustomFields.post([`/:key/:id`, `/:key/:id1/:id2`, '/:key/:id1/:id2/:id3'], async(ctx) => {
    const { key, id1, id2, id3 } = ctx.params;
    if (key === 'save') {
      ctx.params = {
        key: id1,
        id1: id2,
        id2: id3,
      };
      await routeCustomFieldsSave(ctx); return;
    }
    await routeCustomFields(ctx);
  });

  // todo delete data

  router.use('/custom-fields', routerCustomFields.routes());
};
