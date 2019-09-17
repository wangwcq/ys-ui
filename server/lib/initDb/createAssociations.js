const _ = require('lodash');
const Sequelize = require('sequelize');
const utils = require('./utils');

class ModelMissingError extends Error {
  constructor(modelName) {
    super(`Model does not exist: ${modelName}`);
    this.name = 'ModelMissingError';
  }
}

const ex = {};

ex.parseAssiociation = (str, models) => {
  if (str.indexOf('...') !== -1) {
    const [exp, joinModelName] = str.split('@');
    const [partA, partB] = exp.split('...');

    const parseModelAliasKey = (exp) => {
      let [expModel, key] = exp.split('.');
      let [modelName, alias] = exp.split('|');
      if (!alias) {
        alias = _.camelCase(`x_${modelName}s`);
      }
      if (!key) {
        key = _.camelCase(`${modelName}_id`);
      }
      const model = models[modelName];
      if (!model) throw new ModelMissingError(modelName);
      return {
        model,
        name: modelName,
        alias,
        key,
        titleFields: model.fieldsDefinition._titleFields,
        type: utils.getListFieldType(model.fieldsDefinition.type),
        appData: model.fieldsDefinition._appData,
      };
    };

    const A = parseModelAliasKey(partA);
    const B = parseModelAliasKey(partB);

    const modelC = models[joinModelName];
    if (!modelC) throw new ModelMissingError(joinModelName);
    const C = {
      model: modelC,
      name: joinModelName,
    };

    return {
      type: 'm:n',
      A,
      B,
      C,
    };
  }
  const [partA, expModelB] = str.split('=');
  let [expModelA, foreignKey] = partA.split('.');

  const parseModelAlias = (exp, affixAlias = '') => {
    let [modelName, alias] = exp.split('|');
    if (!alias) { alias = _.camelCase(`x_${modelName}${affixAlias}`) }
    const model = models[modelName];
    if (!model) throw new ModelMissingError(modelName);
    return {
      model,
      name: modelName,
      alias,
      titleFields: model.fieldsDefinition._titleFields,
      type: utils.getListFieldType(model.fieldsDefinition.type || 'tag'),
      appData: model.fieldsDefinition._appData,
    };
  };

  const A = parseModelAlias(expModelA, 's');
  const B = parseModelAlias(expModelB);

  if (!foreignKey) {
    foreignKey = _.camelCase(`${B.name}_id`);
  }

  return {
    type: 'n:1',
    A,
    B,
    foreignKey,
  };
};

ex.createN1Association = ({ A, B, foreignKey }) => {
  A.model[B.alias] = A.model.belongsTo(B.model, { as: B.alias, foreignKey });
  B.model[A.alias] = B.model.hasMany(A.model, { as: A.alias, foreignKey });

  A.model.fieldsDefinition._associations.push({
    model: _.omit(B, 'model'),
    foreignKey,
  });
  _.extend(A.model.fieldsDefinition[`__${foreignKey}`], {
    model: _.omit(B, 'model'),
  });
};

ex.createMnAssociation = ({ A, B, C }) => {
  const bindModel = (M, N) => {
    M.model[N.alias] = M.model.belongsToMany(N.model, {
      as: N.alias,
      through: C.model,
      foreignKey: M.key,
      otherKey: N.key,
    });
  };
  bindModel(A, B);
  bindModel(B, A);

  C.model.fieldsDefinition._associations.push({
    model: _.omit(A, 'model'),
    foreignKey: A.key,
  }, {
    model: _.omit(B, 'model'),
    foreignKey: B.key,
  });
  _.extend(C.model.fieldsDefinition[`__${A.key}`], {
    model: _.omit(A, 'model'),
  });
  _.extend(C.model.fieldsDefinition[`__${B.key}`], {
    model: _.omit(B, 'model'),
  });
};

ex.createAssociation = (exp, models) => {
  const params = ex.parseAssiociation(exp, models);
  if (params.type === 'n:1') ex.createN1Association(params);
  if (params.type === 'm:n') ex.createMnAssociation(params);
};

module.exports = ex;