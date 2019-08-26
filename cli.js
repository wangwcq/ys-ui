const fs = require('fs-extra');
const paths = require('path');
const cliUtils = require('@ys/cli-utils');

const main = async () => {
  await fs.copy(
    paths.resolve(__dirname, 'src/app'),
    paths.resolve('./'),
  );

  await cliUtils.runShell(`yarn`);
  await cliUtils.runShell('yarn serve', true);
};

main();
