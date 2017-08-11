const webpack = require('webpack');
const path = require('path');
const config = require('../config.js');
const codeDir = "src";
const buildPath = path.resolve(config.root, codeDir,'dist/dll');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// webpack-dev-server --config webpack.config.simple_entry
const webpackConfig = [
{
  name: "app",
  dependencies: ["vendor"],
  devtool: 'eval',
  // 入口配置
  entry: {
    a: './src/A/index.js',
    b: './src/A/index.js',
    c: './src/A/index.js',
  },
  output: {
    path: buildPath, // 输出文件路径
    filename: '[name].js', // 输出文件名字
    chunkFilename: '[chunkhash].js', // chunk文件名字
   
  },
  // Webpack config options on how to obtain modules
  resolve: {
    // 当你reuire时，不需要加上以下扩展名
    extensions: ['.js', '.md', '.txt'],
  },
  devServer: {
    host: 'localhost',
    port: '4000',
    inline: true
  },
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: path.resolve(buildPath, "manifest.json")
    }),
    // 防止加载所有地区时刻
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // 碰到错误warning但是不停止编译
    new webpack.NoEmitOnErrorsPlugin(),
    // 生成html文件
    new HtmlWebpackPlugin({
      // 输出文件名字及路径
      filename: 'index.html',
      template: 'index.html',
    })
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
      {
        test: /\.less/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.css$/,
        use: 'style-loader!css-loader',
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
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
        loader: 'url-loader?limit=8192&name=[name]-[hash].[ext]'
      }
    ],
  },
}
];

module.exports = webpackConfig;
