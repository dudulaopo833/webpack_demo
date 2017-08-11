### 1. 如何启动
`node webpack.config.extractText/server.js`

### 2. 如何配置

###### webpack config 配置
插件配置

```diff

+const ExtractTextPlugin = require('extract-text-webpack-plugin');

+new ExtractTextPlugin('style.css'), //名字配置
    { 
        test: /\.less/,
_        use: [
_          'style-loader',
_          'css-loader',
_          'less-loader'
_        ]
+        use: ExtractTextPlugin.extract({
+          fallback: 'style-loader',
+          use: ['css-loader', 'less-loader']
+        })
      },
      {
        test: /\.css$/,
-        use: 'style-loader!css-loader',
+         use: ExtractTextPlugin.extract({
+          fallback: 'style-loader',
+          use: ['css-loader']
+        })
      },
```
###### .postcss.config.js文件配置

```js
module.exports = {
  plugins: {
    'postcss-import': {}, // 能够使用import语法 @import "cssrecipes-defaults"; 
    'postcss-cssnext': {}, //PostCSS-cssnext是一个PostCSS插件，可以帮助您使用最新的CSS语法。 它将CSS规范转换为更兼容的CSS，因此您不需要等待浏览器支持。
    'cssnano': {}
  }
}
```
