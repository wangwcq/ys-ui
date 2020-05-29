# @yishitec/web

## Install

```shell script
npm i -S @yishitec/web
npm i nodemon @vue/cli-service less less-loader sass-loader node-sass vue-template-compiler -D
mkdir server
mkdir server/services
mkdir src
touch src/main.js
mkdir src/views
touch src/views/Home.vue
mkdir src/assets
mkdir src/assets/images
mkdir src/assets/images/logo
mkdir src/assets/styles
touch src/assets/styles/app-mixins.less
touch src/assets/styles/app.less
mkdir src/components
touch web.d.ts
touch vue.config.js
```

### package.json

`scripts`

```javascript
    "dev:server": "nodemon -w server -w /Users/wangwcq/node-www/ys-ui server/index.js",
    "dev": "npm run dev:server & npm run serve",
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "start": "node server/index.js"
```

### vue.config.js

```javascript
module.exports = {
  devServer: {
    proxy: 'http://localhost:3000',
  },
};
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
      appName: '智慧工地',
      appLogo: require('./assets/images/logo/logo-horizontal.png'),
    },
    container: {
      maxWidth: '1100px',
    },
  },
});
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

`/server/clients/db.js`

```javascript
const {
  _, Sequelize, initDb, consts,
} = require('@yishitec/web/server');

const { Op } = Sequelize;

const DB_NAME = 'zeba66';

const ex = {
  Sequelize,
  Op,
  db: {
    db: {},
    models: {},
  },
};


/** @type {Models} */
const models = {};

ex.initDb = async () => {
  const res = initDb(
    {
      ...consts.dbConfig,
      constraints: false,
    },
    {
      models,
      associations: []i,
    },
  );
  _.extend(ex.db, res);

  await ex.db.db.sync();

  consts.db = ex.db;

  return ex;
};

module.exports = ex;

```

`/server/index.js`

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
  routers: router => {
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

    router.post('/login', async ctx => {
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

    router.post('/whoami', sessionAuth, async ctx => {
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

    router.post('/change-password', sessionAuth, async ctx => {
      const { oldPassword, newPassword, newPassword2 } = ctx.request.body;
      if (!oldPassword) throw new Error('请输入旧密码');
      if (newPassword !== newPassword2) throw new Error('两次新密码输入不一致');
      if (!newPassword) throw new Error('请输入新密码');
      if (newPassword.length < 4)
        throw new Error('为了您的账号安全，密码长度应大于4位');
      await db.db.transaction(async transaction => {
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

    router.post('/logout', async ctx => {
      // eslint-disable-next-line no-param-reassign
      delete ctx.session.user;
      ctx.jsonOk();
    });

    const syncDb = async () => {
      await db.db.sync({ alter: true });
      console.log('DML synced. ');
    };

    router.get('/migrate/sync', async ctx => {
      await syncDb();
      ctx.jsonOk('OK');
    });

    router.get('/migrate/seed', async ctx => {
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
;
```
