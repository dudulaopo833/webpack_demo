const webpack = require('webpack');
const path = require('path');
const config = require('../config.js');
const codeDir = "src";
const buildPath = path.resolve(config.root, codeDir,'dist/dll');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// webpack-dev-server --config webpack.config.simple_entry
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

module.exports = webpackConfig;
