const KoaRouter = require('koa-router');
const utils = require('../utils');

/**
 * useSubList
 * @param {Object} options
 * @param {Object} options.router
 * @param {string} options.route
 * @param {Object} options.model
 * @param {string} options.association
 * @param {string[]} options.associationInclude
 * @param {Object} options.targetModel
 */
module.exports = (options = {}) => {
  const {
    router = null,
    route = '',
    model = null,
    association = '',
    associationInclude = [],
    targetModel = null,
    attributes = null,
    parseList = (x => x),
  } = options;

  if (!router) throw new Error('use-sub-list: Please input router!');
  if (!model) throw new Error('use-sub-list: Please input model!');
  if (!association) throw new Error('use-sub-list: Please input association!');

  const routerSubList = new KoaRouter();

  routerSubList.post('/:id', async (ctx) => {
    const { id } = ctx.params;
    const res = await model.findOne({
      where: { id },
      include: [
        { association: model[association], include: associationInclude },
      ],
    });
    ctx.jsonOk({
      attributes: attributes || targetModel.crud.listAttributes,
      list: parseList(utils.ensureArray(res[association])),
    });
  });

  router.use(`/sub-list/${route}`, routerSubList.routes());
};
