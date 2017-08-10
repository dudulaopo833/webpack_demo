const webpack = require('webpack');
const path = require('path');
const config = require('../config.js');
const codeDir = "src";
const webpackOutputPath = path.resolve(codeDir, 'dist/simple_entry_hot_replace_with_hotloaderserver');
const buildPath = path.resolve(config.root,webpackOutputPath);
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = {
  // 入口配置
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client', //用于启动hmr
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
          'react-hot-loader/webpack',
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
