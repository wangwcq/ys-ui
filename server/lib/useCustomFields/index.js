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

  routerCustomFields.post(`/:key/:id`, async (ctx) => {
    const { key = '', id = null } = ctx.params;
    if (!id) throw new Error(`${errorPrefixFrontEnd} 请输入正确的数据ID`);

    let fields = await CustomFields.findOne({
      where: {
        key,
      },
    });
    fields = _.get(fields, 'fields');
    fields = utils.safeParseJson(fields, []);

    let data = await CustomFieldsData.findOne({
      where: {
        key,
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
  });

  routerCustomFields.post(`/save/:key/:id`, async (ctx) => {
    const { key = '', id = '' } = ctx.params;
    const body = ctx.request.body;
    if (!id) throw new Error(`${errorPrefixFrontEnd} 请输入正确的数据ID`);

    const [item] = await CustomFieldsData.findOrCreate({
      where: {
        key,
        model: modelName,
        modelId: id,
      },
    });

    await item.update({
      data: JSON.stringify({
        ...body || {},
      }),
    });

    ctx.jsonOk();
  });

  // todo delete data

  router.use('/custom-fields', routerCustomFields.routes());
};
