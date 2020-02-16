# @yishitec/web

## Install

```shell script
yarn add @yishitec/web
yarn add nodemon --dev
mkdir server
mkdir server/services
```

### package.json

`scripts`

```javascript
    "dev:server": "nodemon -w server -w /Users/wangwcq/node-www/ys-ui server/index.js",
    "dev": "yarn dev:server & yarn serve",
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

* ...element-ui components (available by el-* or ui-*)
* ui-page-header
* ui-media-box
* ui-placeholder
* ui-stage
* ui-container
* ui-flex
* ui-admin-table
* ui-admin-form
* ui-data-select
* ui-sub-list
* ui-datetime-picker
* ui-logo

### Core logics (as Vue mixin)

```javascript
import {
  login,
} from '@yishitec/web/core';
```

### Main

`src/main.js`

```javascript
import { main } from '@yishitec/web';
import './assets/styles/app-mixins.less';
import './assets/styles/app.less';

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

`/server/index.js`

```javascript
const { _, main, consts, utils } = require('@ys/ys-ui/server');
const clients = require('./clients');
const apis = require('./apis');

const updateDb = false;
const altDb = false;
const updateDbMeta = false;

main({
  appName: '',
  port: process.env.PORT || 8000,
  serverStartup: async ({ app }) => {
    await clients.db.init({
      sync: updateDb,
      alter: updateDb && altDb,
    });
    consts.db = clients.db;
    updateDbMeta && await clients.dbMetaData();
  },
  routers: router => {
    router.post('/whoami', async (ctx) => {
      if (!ctx.session.user) throw new Error('请先登录');
      ctx.session.user = await ctx.services.User.whoami(ctx.session.user.id);
      ctx.jsonOk(ctx.session.user);
    });
    const sessionAuth = async (ctx, next) => {
      if (!ctx.session.user) {
        ctx.jsonFail('请先登录', undefined, 401);
        return;
      }
      await next();
    };
    router.post('/logout', sessionAuth, async (ctx) => {
      delete ctx.session.user;
      ctx.jsonOk('成功注销');
    });
  },
});
```
