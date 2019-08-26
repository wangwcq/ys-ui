const fs = require('fs-extra');
const paths = require('path');
const cliUtils = require('@ys/cli-utils');

const main = async () => {
  await fs.copy(
    paths.resolve(__dirname, 'src/app'),
    paths.resolve('./'),
  );

  await cliUtils.run(`yarn`);
  await cliUtils.run('yarn serve', true);
};

main();
