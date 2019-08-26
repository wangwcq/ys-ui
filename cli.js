const fs = require('fs-extra');
const paths = require('path');

(async() => {
  await fs.copy(
    paths.resolve(__dirname, 'src/app'),
    paths.resolve('./'),
  );
})();