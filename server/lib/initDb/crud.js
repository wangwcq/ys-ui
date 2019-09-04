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
  let fields = _.map(vFields, (field, fieldName) => {
    if (_.startsWith(fieldName, '__')) {
      fieldName = fieldName.replace('__', '');
    }
    if (_.startsWith(fieldName, '_')) return null;
    const type = utils.getListFieldType(field.type);
    if (type === 'password') return null;
    const title = field.title || _.upperFirst(_.startCase(fieldName));

    let { width, minWidth, align } = field;

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
    {
      name: 'id',
      title: 'ID',
      type: 'id',
      align: 'center',
      width: 80,
    },
    ...fields,
    ...dbCommonFields,
  ];
  return fields;
};

const getFormAttributes = (vFields) => {
  let fields = _.map(vFields, (field, fieldName) => {
    if (_.startsWith(fieldName, '__')) {
      fieldName = fieldName.replace('__', '');
    }
    if (_.startsWith(fieldName, '_')) return null;
    const type = utils.getFormFieldType(field.type);
    const title = field.title || _.upperFirst(_.startCase(fieldName));

    return {
      ...field,
      name: fieldName,
      title,
      type,
    };
  }).filter(Boolean);
  fields = [
    {
      name: 'id',
      title: 'ID',
      type: 'readonly__id',
      align: 'center',
      width: 80,
    },
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
  model.crud.newItem = fields._newItem || (() => createNewItemByFields(model.crud.formAttributes));
  model.crud.listAll = async function () {
    const res = await model.findAll({
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
    const item = await model.findOne({
      where: { id },
      include: _.map(_.filter(model.crud.formAttributes, attribute => attribute.model), (field) => {
        const { model: association } = field;
        return {
          association: model[association.alias],
          attributes: models[association.name].fieldsDefinition._titleFields,
        };
      }),
    });
    return item;
  };
  model.crud.saveItem = async function (data, id) {
    const [item] = await model.findOrCreate({
      where: { id: id || 0 },
      defaults: { ..._.filter(_.omit(data, ['id']), Boolean) },
    });
    const saveData = { ...data };
    _.forEach(model.crud.formAttributes, field => {
      if (field.model && !saveData[field.name]) {
        saveData[field.name] = null;
      }
    });
    await item.update(data);
    return item;
  }
};

module.exports = ex;