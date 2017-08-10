### 1.如何启动
`webpack-dev-server --config webpack.config.simple_entry_hot_replace_with_hotloader`

### 2.注意点
HtmlWebpackPlugin不能和该插件一起使用，如果想使用该插件，请使用自建服务器，参考


### 3.如何配置

#### webpack config 配置
  * 入口配置
  * 添加devServer配置
  * 添加HotModuleReplacementPlugin插件
  * 除去HtmlWebpackPlugin

### 源码实现
#### webpack config源码
```diff
const webpack = require('webpack');
const path = require('path');
const config = require('../config.js');
const codeDir = "src";
const webpackOutputPath = path.resolve(codeDir, 'dist/simple_entry_hot_replace_with_hotloader');
const buildPath = path.resolve(config.root,webpackOutputPath);
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = {
  // 入口配置
  entry: [
+    'react-hot-loader/patch',
+    'webpack-dev-server/client?http://0.0.0.0:4000', // WebpackDevServer host and port
+    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    './src/React_hot_loader/index.js'
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
+  devServer: {
+    host: 'localhost',
+    port: 4000,
+
+    historyApiFallback: true,
+    // respond to 404s with index.html

+    hot: true,
+    // enable HMR on the server
+  },
  plugins: [
+    new webpack.HotModuleReplacementPlugin(),
    // 防止加载所有地区时刻
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Webpack 2以后内置
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // 碰到错误warning但是不停止编译
    new webpack.NoEmitOnErrorsPlugin(), 
    // 生成html文件
-    // new HtmlWebpackPlugin({ 
-    //     // 输出文件名字及路径
-    //   filename: 'index.html',
-    //   template: 'index.html'
-    // }),
     new webpack.NamedModulesPlugin(),
  
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

#### src源码

```js
if (module.hot) module.hot.accept('./App', () => render(App));
```

#### .babelrc

```diff
{
  "env":{
    "production": {
      "presets": [
        "es2015",
        "react",
        "stage-0"
      ],
      "plugins": ["transform-decorators-legacy","add-module-exports", "transform-object-assign"]
    },
    "development": {
      "presets": [
        // http://babeljs.io/docs/plugins/preset-es2015/#modules
        // 默认将es6选以commonJs类型进行转化
+        ["es2015", 
+         { "modules": false }
+       ],
-       // "es2015",
        "react",
        "stage-0"
      ],
+      "plugins": ["react-hot-loader/babel"]
    }
  }
 
  
}
```
