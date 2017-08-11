/* eslint import/no-extraneous-dependencies: ["off"] */

const path = require('path');
const webpack = require('webpack');
// 服务器框架
const express = require('express');
const config = require('./webpack.config');
const defautlConfig = require('../config.js');

const compiler = webpack(config);
const app = express();

const spawn = require('child_process').spawn;
const isWin = /^win/.test(process.platform);

let buildProcess = null;
if (isWin) {
  buildProcess = spawn('cmd', ['/c', 'webpack --progress --config webpack.config.dll/webpack.config.js']);
} else {
  buildProcess = spawn('webpack', ['--progress', '--config', 'webpack.config.dll/webpack.config.js']);
}

buildProcess.stdout.pipe(process.stdout);
buildProcess.stderr.pipe(process.stderr);

buildProcess.on('exit', (code) => {
  // 热更新
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    hot: true,
    inline: true,
    // publicPath: 'dist'
  }));
  
  app.get('*', (req, res) => {
    if (req.url.indexOf('vendor.js') >= 0) {
      res.sendFile(path.join(defautlConfig.root, 'src/dist/dll/vendor.js'));
    }else{
      res.status(404);
      res.end();
    }
  });
  // 启动服务
  app.listen("4000", '0.0.0.0', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(' start server at port ' + '4000');
  });


});
