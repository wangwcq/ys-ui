const _ = require('lodash');
const utils = require('./utils');

const COLUMN_WIDTH_DATETIME = 140;
const COLUMN_MIN_WIDTH = 100;

const ex = {};

const dbCommonFields = [
  {
    name: 'createdAt',
    title: '创建时间',
    type: 'datetime',
    width: COLUMN_WIDTH_DATETIME,
    align: 'center',
  },
  {
    name: 'updatedAt',
    title: '更新时间',
    type: 'datetime',
    width: COLUMN_WIDTH_DATETIME,
    align: 'center',
  },
];

const getListAttributes = (vFields) => {
  let hideId = false;
  let fields = _.map(vFields, (field, fieldName) => {
    if (_.startsWith(fieldName, '__')) {
      fieldName = fieldName.replace('__', '');
    }
    else if (_.startsWith(fieldName, '_')) return null;
    const type = utils.getListFieldType(field.type);
    if (type === 'password') return null;
    const title = field.title || _.upperFirst(_.startCase(fieldName));

    let { width, minWidth, align, inList = true } = field;

    if (!inList) {
      if (fieldName === 'id') hideId = true;
      return null;
    }

    if (!width) {
      if (type === 'datetime') width = COLUMN_WIDTH_DATETIME;
    }
    if (!minWidth) {
      minWidth = COLUMN_MIN_WIDTH;
    }
    if (!align) {
      if (type === 'number') align = 'right';
      else if (type === 'datetime') align = 'center';
    }

    return {
      ...field,
      name: fieldName,
      title,
      type,
      width,
      minWidth,
      align,
    };
  }).filter(Boolean);
  fields = [
    ...hideId ? [] : [{
      name: 'id',
      title: 'ID',
      type: 'id',
      align: 'center',
      width: 80,
    }],
    ...fields,
    ...dbCommonFields,
  ];
  return fields;
};

const getFormAttributes = (vFields) => {
  let isIdPreDefined = false;
  let fields = _.map(vFields, (field, fieldName) => {
    if (_.startsWith(fieldName, '__')) {
      fieldName = fieldName.replace('__', '');
    }
    if (_.startsWith(fieldName, '_')) return null;
    if (fieldName === 'id') {
      isIdPreDefined = true;
    }
    let type = utils.getFormFieldType(field.type);
    if (field.model && type !== 'hidden') {
      type = 'model';
    }
    if (field.readonly) { type = `readonly__${type}`; }
    const title = field.title || _.upperFirst(_.startCase(fieldName));

    return {
      ...field,
      name: fieldName,
      title,
      type,
    };
  }).filter(Boolean);
  fields = [
    ...isIdPreDefined ? [] : [{
      name: 'id',
      title: 'ID',
      type: 'readonly__id',
      align: 'center',
      width: 80,
    }],
    ...fields,
    ..._.merge([], dbCommonFields, [
      { type: 'readonly__datetime' },
      { type: 'readonly__datetime' },
    ]),
  ];
  return fields;
};

const createNewItemByFields = (formAttributes) => {
  const item = {};
  _.forEach(formAttributes, field => {
    item[field.name] = utils.getTypeDefaultValue(field.type);
  });
  return item;
};

ex.buildCrudUtils = (model, models) => {
  const fields = model.fieldsDefinition;
  model.crud = {};
  model.crud.listAttributes = getListAttributes(fields);
  model.crud.formAttributes = getFormAttributes(fields);
  model.crud.newItem = (ctx) => {
    let item = {};
    if (fields._newItem) {
      item = fields._newItem(ctx);
    } else {
      item = createNewItemByFields(model.crud.formAttributes);
    }
    return _.extend(item, { ..._.get(ctx, 'request.body') });
  };
  model.crud.listAll = async function (options = {}) {
    const { where = {} } = options;

    const res = await model.findAll({
      where,
      order: [
        ['id', 'desc'],
      ],
      include: _.map(_.filter(model.crud.listAttributes, attribute => attribute.model), (field) => {
        const { model: association } = field;
        return {
          association: model[association.alias],
          attributes: models[association.name].fieldsDefinition._titleFields,
        };
      }),
    });
    return res;
  };
  model.crud.getItemById = async function (id) {
    let vId = id;
    if (typeof vId !== 'object') {
      vId = { id: vId };
    }
    const item = await model.findOne({
      where: vId,
      include: _.filter(_.map(_.filter(model.crud.formAttributes, attribute => attribute.model), (field) => {
        const { model: association } = field;
        if (!model[association.alias]) {
          return;
        }
        return {
          association: model[association.alias],
          attributes: models[association.name].fieldsDefinition._titleFields,
        };
      }), Boolean),
    });
    return item;
  };
  model.crud.saveItem = async function (data, id) {
    const saveData = { ...data };
    _.forEach(model.crud.formAttributes, field => {
      if (field.model && !saveData[field.name]) {
        saveData[field.name] = null;
      }
    });

    const where = {};
    _.forEach(model.primaryKeyAttributes, field => {
      where[field] = _.get(data, field, null);
    });
    const [item] = await model.findOrCreate({
      where,
      defaults: saveData,
    });
    await item.update(saveData);
    return item;
  };
  model.crud.deleteItem = async function(id) {
    let vId = id;
    if (typeof vId !== 'object') { vId = { id: vId }; }
    const item = await model.findOne({ where: vId });
    if (!item) return { code: 1, message: '指定的数据不存在' };
    await item.destroy();
    return { code: 0 };
  };
};

module.exports = ex;
