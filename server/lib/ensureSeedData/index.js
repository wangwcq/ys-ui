const _ = require('async-dash');
const consts = require('../consts');

module.exports = async (seedData = {}, options = {}) => {
  const {
    models = {},
  } = options;
  const flattened = _.flatten(_.map(seedData || {}, (list, modelName) =>
    _.map(list, (data) => ({
      modelName,
      data,
    }))
  ));
  try {
    await _.asyncParallelEach(flattened, async (entry) => {
      const model = models[entry.modelName];
      if (!model) throw new Error(`Model ${entry.modelName} is not found!`);
      const { data } = entry;
      await model.findOrCreate({
        where: {
          ...data,
        },
        defaults: {
          ...data,
        },
      });
    }, consts.parallelSize);
  } catch (e) {
    console.error(e);
  }
};
