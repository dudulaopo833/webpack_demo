`webpack-dev-server --config webpack.config.simple_entry_hot_replace_with_hotloader`
不能和这个一起用new HtmlWebpackPlugin({ 
        // 输出文件名字及路径
      filename: 'index.html',
      template: 'index.html'
    }),
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