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

  routerComments.post([`/list/:id`, `/list/:id1/:id2`], async (ctx) => {
    let { id = null, id1 = null, id2 = null } = ctx.params;
    if (!id && id1 && id2) { id = `${id1}/${id2}`; }
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

  routerComments.post([`/post/:id`, '/post/:id1/:id2'], async (ctx) => {
    let { id = '', id1 = null, id2 = null } = ctx.params;
    if (!id && id1 && id2) { id = `${id1}/${id2}`; }

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
