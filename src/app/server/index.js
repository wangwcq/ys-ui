const { main, Logger } = require('@yishitec/web/server');

main({
  appName: 'WANLYAN ERP',
  port: 8001,
  serverStartup: async () => {
    const logger = Logger('Server startup');
    // todo init db
  },
  routers: router => {
  },
});
