### 1. 启动

第一种方式：

`webpack --config webpack.config.dll`


需要打开生成的index.html

第二种方式：

` node webpack.config.dll/server.js`

`open http://localhost:4000`

### 2. 如何配置

###### webpack config 配置

```js
const webpackConfig = {
  name: "vendor",
  entry: ["react", "react-dom"],
  output: {
    path: buildPath, // 输出文件路径
    filename: "vendor.js",
    library: "vendor_[hash]"
  },
  plugins: [
    new webpack.DllPlugin({
      name: "vendor_[hash]",
      path: path.resolve(buildPath, "manifest.json")
    })
  ]
};
```

```diff
 name: "app",
+ dependencies: ["vendor"],
 devtool: 'eval',

+  new webpack.DllReferencePlugin({
+     manifest: path.resolve(buildPath, "manifest.json")
+    }),
```