const _ = require('lodash');
const Sequelize = require('sequelize');
const utils = require('./utils');
const { createAssociation } = require('./createAssociations');
const { buildCrudUtils } = require('./crud');

const {
  Model,
  Op,
} = Sequelize;

module.exports = (dbConfig = {}, dbDefinition = {}) => {
  const {
    host = '127.0.0.1',
    port = '3306',
    username = 'root',
    password = '',
    database = '',
    debug = false,
    constraints = true,
  } = dbConfig;
  const {
    models: vModels,
    associations = [],
  } = dbDefinition;

  const options = {
    host,
    port,
    dialect: 'mysql',
    timezone: '+08:00',
    define: {
      hooks: {
        beforeValidate: () => db.query('SET autocommit = 1'),
      },
    },
  };
  if (!debug) {
    _.set(options, 'logging', () => {});
  }
  const db = new Sequelize(
    database,
    username,
    password,
    options,
  );

  const models = {};
  _.forEach(vModels, (fields, modelName) => {
    const x = {
      [modelName]: class extends  Model {},
    };
    const model = x[modelName];
    let paranoid = true;
    let apiName = _.kebabCase(modelName);
    let tableName = undefined;
    let timestamps = true;
    const attributes = {};

    _.forEach(fields, (field, fieldName) => {
      field.name = fieldName;
      if (_.startsWith(fieldName, '__' && fieldName !== '__id')) return true;
      if (_.startsWith(fieldName, '_')) {
        if (fieldName === '_paranoid') paranoid = field;
        else if (fieldName === '_apiName') apiName = field;
        else if (fieldName === '_tableName') tableName = field;
        else if (fieldName === '_timestamps') timestamps = field;
        return true;
      }
      attributes[fieldName] = utils.getFieldType(field.type);
    });

    model.init(attributes, {
      sequelize: db,
      paranoid,
      tableName,
      timestamps,
    });

    fields._associations = [];
    fields._titleFields = _.map(_.filter(fields, field => field.isTitle), field => field.name);
    if (!fields._titleFields.length) {
      if (fields.title) fields._titleFields = ['title'];
      else if (fields.displayName) fields._titleFields = ['displayName'];
      else if (fields.name) fields._titleFields = ['name'];
    }
    fields._appData = {
      apiName,
    };
    model.fieldsDefinition = fields;

    models[modelName] = model;
  });

  _.forEach(associations, (exp) => {
    createAssociation(exp, models, constraints);
  });

  _.forEach(models, (model, modelName) => {
    buildCrudUtils(model, models);
  });

  db.Sequelize = Sequelize;
  db.Op = Op;

  return {
    db,
    models,
  };
};
