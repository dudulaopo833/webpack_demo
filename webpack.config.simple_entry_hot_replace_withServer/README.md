# 启动
`node ./webpack.config.simple_entry_hot_replace_withServer/server.js`
## 基本全局热更新配置
### 代码diff

```diff
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

