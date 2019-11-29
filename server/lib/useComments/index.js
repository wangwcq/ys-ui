const _ = require('lodash');
const KoaRouter = require('koa-router');
const consts = require('../consts');
const utils = require('../utils');

const errorPrefix = 'Error useComments:';
const errorPrefixFrontEnd = '无法获取评论：';

module.exports = function(options = {}) {
  const {
    // required
    router = null,
    key = '',
    modelName = null,
  } = options;

  if (!router) throw new Error(`${errorPrefix} Please pass in router!`);
  if (!modelName) throw new Error(`${errorPrefix} Please input model name!`);

  const routerComments = new KoaRouter();

  routerComments.post(`/list/:id`, async (ctx) => {
    const { id = null } = ctx.params;
    if (!id) throw new Error(`${errorPrefixFrontEnd} 请输入正确的数据ID`);
    const list = await consts.db.models.Comment.findAll({
      where: {
        modelType: modelName,
        modelKey: id,
      },
      order: [['createdAt', 'desc']],
      include: [{
        association: 'xCommentUser',
        attributes: ['displayName'],
      }],
    });
    ctx.jsonOk(list);
  });

  routerComments.post(`/post/:id`, async (ctx) => {
    const { id = '' } = ctx.params;
    const body = ctx.request.body;
    if (!id) throw new Error(`${errorPrefixFrontEnd} 请输入正确的数据ID`);

    await consts.db.models.Comment.create({
      modelType: modelName,
      modelKey: id,
      comment: body.comment,
      userId: _.get(ctx, 'session.user.id'),
    });

    ctx.jsonOk();
  });

  router.use('/comments', routerComments.routes());
};
