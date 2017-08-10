# 启动
`node ./webpack.config.simple_entry_hot_replace_withServer/server.js`
## 基本全局热更新配置
### 代码diff

```diff
const webpack = require('webpack');
const path = require('path');
const config = require('../config.js');
const codeDir = "src";
const webpackOutputPath = path.resolve(codeDir, 'dist/simple_entry_hot_replace_withServer');
const buildPath = path.resolve(config.root,webpackOutputPath);
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = {
  // 入口配置
  entry: [
    // http://webpack.github.io/docs/hot-module-replacement-with-webpack.html
+    'webpack-hot-middleware/client?reload=true',
    './src/A/index.js'
  ],
  // Webpack config options on how to obtain modules
  resolve: {
    // 当你reuire时，不需要加上以下扩展名
    extensions: ['.js', '.md', '.txt'],
  },
  devtool: 'eval',
  // 输出配置
  output: {
    path: buildPath, // 输出文件路径
    filename: 'app.js', // 输出文件名字
    chunkFilename: '[chunkhash].js', // chunk文件名字
  },
  plugins: [
+    new webpack.HotModuleReplacementPlugin(),
    // 防止加载所有地区时刻
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Webpack 2以后内置
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // 碰到错误warning但是不停止编译
    new webpack.NoEmitOnErrorsPlugin(), 
    // 生成html文件
    new HtmlWebpackPlugin({ 
        // 输出文件名字及路径
      filename: 'index.html',
      template: 'index.html'
    }),
    // new webpack.NamedModulesPlugin(),
  
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
           'babel-loader',
        ],
        exclude: /node_modules/,
      },
    // webpack2 以后内置配置
    //   {
    //     test: /\.json$/,
    //     use: 'json-loader',
    //   },
      {
        test: /\.less/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.txt$/,
        use: 'raw-loader',
      },
      {
        test: /\.md$/,
        use: 'raw-loader',
      },
      {
        test: /\.css$/,
        use: 'style-loader!css-loader!postcss-loader',
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
        loader: 'url-loader?limit=8192&name=[name]-[hash].[ext]'
      }
    ],
  },
};

module.exports = webpackConfig;

```

### Server代码添加

```
/* eslint import/no-extraneous-dependencies: ["off"] */

const path = require('path');
const webpack = require('webpack');
// 服务器框架
const express = require('express');
const config = require('./index');


const compiler = webpack(config);
const app = express();

// 热更新
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  hot: true,
  inline: true,
  // publicPath: 'dist'
}));

app.use(require('webpack-hot-middleware')(compiler));

// 启动服务
app.listen("4000", '0.0.0.0', (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(' start server at port ' +'4000');
});


```

# 热替换详解
### 主题人物
* webpack-dev-server
* webpack-hot-middleware
* webpack-dev-middleware
* react-hot-loader

---
1. __webpack-dev-server__

	webpack官方提供的一个简易服务器，可以让我们快速的启动服务，配置devServer hot 为true即可，这个属于全局刷新

2. __webpack-hot-server&webpack-dev-middleware__:

	当我们想要在自己服务器上使用全局刷新功能时使用
	
3. __react-hot-loader__

	当我们想要局部刷新，并且不改变当前