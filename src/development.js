require('colors');
require('babel-polyfill');
const Koa = require('koa');
const webpack = require('webpack');
const webpackServer = require('koa-webpack-server');
const configs = require('../config/webpack.dev.config');

const app = new Koa();

const options = {
  compilers: webpack(configs),
  dev: {
    noInfo: false,
    quiet: true,
    serverSideRender: true,
  },
};

console.log(`${'[SYS]'.rainbow} webpack building...`);

webpackServer(app, options).then(({ middlewares }) => {
  // hot-middlewares: you may try making any changes from middlewares, 
  // it will automatically rebuild and reload,
  // so that you don't have to reboot your server to see the changes.
  const { logger, render } = middlewares;

  // apply middlewares
  app.use(logger);
  app.use(render);

  // start server
  app.listen(process.env.PORT, () => {
    console.log(`${'[SYS]'.rainbow} server started at port ${process.env.PORT}`);
  });
}).catch((err) => {
  console.error(err);
});