### 1. 如何启动
`node webpack.config.simple_entry_hot_replace_with_hotloaderserver/server.js`

### 2. 如何配置

###### webpack config 配置
  * 入口配置

###### src入口文件配置

###### .babelrc文件配置

###### server.js 文件配置
  * 添加webpack-hot-middleware 用于开启hmr
  * webpack-dev-middleware 用于设置hot为true

### 3. 源码实现

#### webpack config源码
```diff
const webpackConfig = {
  // 入口配置
  entry: [
    'react-hot-loader/patch',
+    'webpack-hot-middleware/client',  //用于启动hmr
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
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // 防止加载所有地区时刻
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Webpack 2以后内置
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // 碰到错误warning但是不停止编译
    new webpack.NoEmitOnErrorsPlugin(), 
    // 生成html文件
    // new HtmlWebpackPlugin({ 
    //     // 输出文件名字及路径
    //   filename: 'index.html',
    //   template: 'index.html'
    // }),
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
```

#### server.js源码

```diff

// 热更新
+app.use(require('webpack-dev-middleware')(compiler, {
+  noInfo: true,
+  hot: true,
+  historyApiFallback: true
+}));

+app.use(require("webpack-hot-middleware")(compiler));
+
+app.get('*', (request, response) => {
+  response.sendFile(path.resolve(defaultConfig.root, 'index.html'));
+});

// 启动服务
app.listen("4000", '0.0.0.0', (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(' start server at port ' +'4000');
});


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