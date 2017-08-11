const webpack = require('webpack');
const path = require('path');
const config = require('../config.js');
const codeDir = "src";
const buildPath = path.resolve(config.root, codeDir,'dist/commonchunk');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = {
  devtool: 'eval',
  // 入口配置
  entry: {
    vendor: ['react','react-dom'],
    a: './src/A/index.js',
    b: './src/A/index.js',
    c: './src/A/index.js',
  },
  output: {
    path: buildPath, // 输出文件路径
    filename: '[name].js', // 输出文件名字
    chunkFilename: '[chunkhash].js' // chunk文件名字
  },
  // Webpack config options on how to obtain modules
  resolve: {
    // 当你reuire时，不需要加上以下扩展名
    extensions: ['.js', '.md', '.txt'],
  },
  devServer: {
    port: '4000',
    inline: true
  },
  plugins: [
    // 防止加载所有地区时刻
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
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
    // 如果有其他CommonsChunkPlugin生成的文件，将会引入
    // - If chunk has the name as specified in the chunkNames it is put in the list
    // - If no chunk with the name as given in chunkNames exists a new chunk is created and added to the list
    // 大概意思就是如果name在entry里面有，那就加入一个列表，如果entry里面没有，
    // 那么就创建一个新chunk列表,如果chunks里面相同模块代码出现次数超过minChunks,那就添加到这个新创建的list里面。
    new webpack.optimize.CommonsChunkPlugin({
      name: "common",
      chunks: ["a", "b"], //需要合并的文件
      // minChunks:3 //意味着最少在出现过多少次才将其打入commons中
    }),
    //如果
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      name: "vendor",
      minChunks: Infinity
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
};

module.exports = webpackConfig;
