# @yishitec/web

## Install

```shell script
echo "dist\nnode_modules" > .gitignore
cnpm i -S @yishitec/web
cnpm i nodemon @vue/cli-service less less-loader sass-loader node-sass vue-template-compiler vue-cli-plugin-style-resources-loader style-resources-loader pug pug-plain-loader -D
mkdir server
mkdir server/clients
touch server/clients/index.js
touch server/clients/db.js
mkdir server/services
touch server/services/index.js
mkdir server/apis
touch server/apis/index.js
touch server/index.js
mkdir public
touch public/index.html
touch public/favicon.ico
mkdir src
touch src/main.js
mkdir src/views
touch src/views/Home.vue
mkdir src/assets
mkdir src/assets/images
mkdir src/assets/images/logo
touch src/assets/images/logo/logo-horizontal.png
mkdir src/assets/styles
touch src/assets/styles/app-mixins.scss
touch src/assets/styles/app.scss
mkdir src/components
touch web.d.ts
touch vue.config.js
echo "OK"
```

### Configure eslint

```shell script
cnpm i -D @vue/cli-plugin-eslint @vue/eslint-config-airbnb babel-eslint eslint eslint-plugin-vue
touch .eslintrc.js
```

### `eslintrc.js`

```javascript
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/essential'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['vue'],
  rules: {},
};
```

### package.json

`scripts`

```javascript
    "dev:server": "nodemon -w server server/index.js",
    "dev": "npm run dev:server & npm run serve",
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "start": "node server/index.js"
```

### vue.config.js

```javascript
const paths = require('path');

module.exports = {
  devServer: {
    proxy: 'http://localhost:3000',
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        paths.resolve(__dirname, './src/assets/styles/app-mixins.scss'),
      ],
    },
  },
};
```

### Public/index.html

`public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <link rel="icon" href="<%= BASE_URL %>favicon.ico" />
    <title>欢迎使用</title>
  </head>
  <body>
    <noscript>
      <strong>
        We're sorry but workspace-chris doesn't work properly without JavaScript enabled. Please enable it to continue.
      </strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

### Main

`src/main.js`

```javascript
import { main } from '@yishitec/web';
import './assets/styles/app-mixins.scss';
import './assets/styles/app.scss';

import Home from './views/Home.vue';

main({
  routes: [
    {
      component: Home,
      name: 'home',
      path: '/',
      children: [],
    },
  ],
  componentsConfig: {
    common: {
      appName: '欢迎使用',
      appLogo: require('./assets/images/logo/logo-horizontal.png'),
    },
    container: {
      maxWidth: '1100px',
    },
  },
});
```

- 修改appName

### 放入Logo文件 `assets/images/logo/logo-horizontal.png`

## `/server/clients/db.js`

Variables:

- `{DB_NAME}`

```javascript
const { _, Sequelize, initDb, consts } = require('@yishitec/web/server');

const { Op } = Sequelize;

const ex = {
  Sequelize,
  Op,
  db: {
    db: {},
    models: {},
  },
};

const models = {};

ex.initDb = async () => {
  const res = initDb(
    {
      ...consts.dbConfig,
      constraints: false,
    },
    {
      models,
      associations: [],
    },
  );
  _.extend(ex.db, res);

  await ex.db.db.sync();

  consts.db = ex.db;

  return ex;
};

module.exports = ex;
```

### `/server/index.js`

```javascript
const { _, main, consts, utils, moment } = require('@yishitec/web/server');
const services = require('./services');
const { initDb, db, Op } = require('./clients/db');
const apis = require('./apis');

consts.dbConfig = {
  host: consts.env.DB_HOST || 'localhost',
  port: consts.env.DB_PORT || 3306,
  username: consts.env.DB_USERNAME || 'yschris',
  password: consts.env.DB_PASSWORD || 'Welcome@888',
  database: consts.env.DB_DATABASE || 'zeba66',
  debug: false,
};

let requestIndex = 0;

main({
  appName: 'Zeba66Admin',
  port: consts.env.PORT || 3000,
  serverStartup: async () => {
    await utils.withTry(async () => {
      await initDb();
      console.log('DB ready');
    });
    await Promise.all([]);
  },
  routers: (router) => {
    router.use(async (ctx, next) => {
      const startTime = Date.now();
      requestIndex += 1;
      console.log('req', {
        requestIndex,
        url: ctx.path, // todo
        params: ctx.params,
        query: ctx.request.query,
        body: ctx.request.body,
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
      });
      await next();
      console.log('res', {
        requestIndex,
        duration: Date.now() - startTime,
      });
    });

    router.post('/login', async (ctx) => {
      const { username, password, appId = 1 } = ctx.request.body;
      if (!username) throw new Error('请输入用户名');
      if (!password) throw new Error('请输入密码');
      const findUser = await db.models.User.findOne({
        where: {
          username,
          password: utils.encodePassword(password),
          appId,
        },
      });
      if (!findUser) throw new Error('账号或密码错误');
      const user = findUser.toJSON();
      delete user.password;
      // eslint-disable-next-line no-param-reassign
      ctx.session.user = user;
      ctx.jsonOk(ctx.session.user);
    });

    const sessionAuth = async (ctx, next) => {
      if (!ctx.session.user) {
        ctx.jsonFail('请先登录', undefined, 401);
        return;
      }
      await next();
    };

    router.post('/whoami', sessionAuth, async (ctx) => {
      const findUser = await db.models.User.findOne({
        where: {
          id: ctx.session.user.id,
        },
        include: [],
      });
      if (!findUser) {
        // eslint-disable-next-line no-param-reassign
        delete ctx.session.user;
        throw new Error('找不到指定的用户');
      }
      const user = findUser.toJSON();
      // eslint-disable-next-line no-param-reassign
      delete user.password;
      ctx.jsonOk(user);
    });

    router.post('/change-password', sessionAuth, async (ctx) => {
      const { oldPassword, newPassword, newPassword2 } = ctx.request.body;
      if (!oldPassword) throw new Error('请输入旧密码');
      if (newPassword !== newPassword2) throw new Error('两次新密码输入不一致');
      if (!newPassword) throw new Error('请输入新密码');
      if (newPassword.length < 4)
        throw new Error('为了您的账号安全，密码长度应大于4位');
      await db.db.transaction(async (transaction) => {
        await db.models.User.update(
          {
            password: utils.encodePassword(newPassword),
          },
          {
            where: {
              id: ctx.session.user.id,
            },
            transaction,
          },
        );
      });
      ctx.jsonOk('OK');
    });

    router.post('/logout', async (ctx) => {
      // eslint-disable-next-line no-param-reassign
      delete ctx.session.user;
      ctx.jsonOk();
    });

    const syncDb = async () => {
      await db.db.sync({ alter: true });
      console.log('DML synced. ');
    };

    router.get('/migrate/sync', async (ctx) => {
      await syncDb();
      ctx.jsonOk('OK');
    });

    router.get('/migrate/seed', async (ctx) => {
      await db.models.User.findOrCreate({
        where: {
          username: 'admin',
          appId: 1,
        },
        defaults: {
          username: 'admin',
          password: utils.encodePassword('admin'),
          appId: 1,
        },
      });
      ctx.jsonOk('OK');
    });
  },
});
```

### Server export dir modules

```javascript
const { requireDir } = require('@yishitec/web/server');

module.exports = requireDir(__dirname);
```

- `server/clients/index.j`
- `server/services/index.js`
- `server/apis/index.js`

# Verify

```shell
npm run dev
```


## Front-end

Exported:

```javascript
import {
  Vue,
  _, // async-dash
  lodash, // async-dash
  axios,
  moment,
  numeral,
  main,
  views, // see below
  G, // an empty object for global data storage
  formatPrice // numeral: 0,0.00
  containsText, // moment: YYYY-MM-DD HH:mm:ss
  flattenedValues, // flatten, uniq, can apply to object
} from '@yishitec/web';

const {
  LoginView,
  ContainerView,
  PageHeaderView,
  ErrorView,
} = views;
```

### Available components

- ...element-ui components (available by el-_ or ui-_)
- ui-page-header
- ui-media-box
- ui-placeholder
- ui-stage
- ui-container
- ui-flex
- ui-admin-table
- ui-admin-form
- ui-data-select
- ui-sub-list
- ui-datetime-picker
- ui-logo

### Core logics (as Vue mixin)

```javascript
import { login } from '@yishitec/web/core';
```


## Back-end

Components:

```javascript
const {
  main, // uses Koajs
  Logger, // uses pino
  requireDir,
  lodash,
  axios,
  moment,
  numeral,
  _: lodash,
  utils,
  Router, // uses koa-joi-router
  consts, // an object for global data storage with preset properties; see below
  Sequelize,

  initDb, // uses Sequelize
  ensureSeedData,

  useCustomFields,
  useSubList,
  useComments,
} = require('@yishitec/web');

const {
  db = null,
  env, // = process.env
} = consts;
```

### Main

`/server.d.ts`

```typescript
type Consts = {};

type YishitecWeb = {
  consts: Consts;
  _;
  moment;
};

type Ctx = {
  session: {
    user: {
      member_id;
      display_name;
    };
  };
  params: Record<string, string>;
  request: {
    body: object;
    query: Record<string, string>;
  };
};

type AdminListQuery = {
  currentProjects: number[] | string[];
  filter: number | string;
};

interface ModelColumnDefinition {
  title;
  readonly: boolean;
  isTitle: boolean;
  inList: boolean;
  type: 'password' | 'text' | 'select' | 'datetime';
  options: string[];
  ignored: boolean;
  width: number;
}

type ModelColumnsDefinition = Record<string, ModelColumnDefinition>;

interface ModelDefinition extends ModelColumnsDefinition {
  _tableName;
  _paranoid: boolean;
  _timestamps: boolean;
  _apiName;
  _newItem: (ctx: Ctx) => object;
}

type Models = Record<string, ModelDefinition>;

interface ModelCommon {
  member_id: object | number | string;
}
```