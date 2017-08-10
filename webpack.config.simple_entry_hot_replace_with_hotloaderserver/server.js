/* eslint import/no-extraneous-dependencies: ["off"] */

const path = require('path');
const webpack = require('webpack');
// 服务器框架
const express = require('express');
const config = require('./index');
const defaultConfig = require('../config.js');

const compiler = webpack(config);
const app = express();

// 热更新
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  hot: true,
  historyApiFallback: true
}));
app.use(require("webpack-hot-middleware")(compiler));

app.get('*', (request, response) => {
  response.sendFile(path.resolve(defaultConfig.root, 'index.html'));
});

// 启动服务
app.listen("4000", '0.0.0.0', (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(' start server at port ' +'4000');
});

