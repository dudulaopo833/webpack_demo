启动

`webpack-dev-server --config webpack.config.base`


### 基础打包配置

#### 1. __[开发模式(devtool)](https://webpack.js.org/configuration/devtool/)__  

	[demo](https://github.com/chenzhiwei199/webpack_demo/tree/master/webpack.config.base)
	
	This option controls if and how source maps are generated.
	
	开发建议使用eval模式，缺点是无法正确显示行号，想要正确显示行号，可以时候用source-map或者eval-source-map
	
	生产环境： 建议使用cheap-module-source-map

#### 2. __入口配置(entry)__

	```js
		string | [string] | object { <key>: string | [string] } | (function: () => string | [string] | object { <key>: string | [string] })
	```
	
	 入口打包根场景不同，入口配置也不同。
	 
	 * 单入口：
	 
	 ```js
	 entry: './A/index.js'
	  
	 entry: [
	    './A/index.js',
	  ],
	 ```
	 
	 * 多入口：
	 
	 ```js
	 entry: [
	    './A/index.js',
	    './B/index.js'
	  ],
	
	 entry: {
	    A: './A/index.js',
	    B: './B/index.js'
	  }
	 ```

#### 3. __输出配置(output)__

 * 输出路径配置：
 
 ```js
 output: {
 	// path.resolve用来拼接文件多级目录
 	// __dirname 为当前文件所在全路径地址
 	path: path.resolve(__dirname,'dist'), 
 	// 输出文件名字
	// filename: 'app.js', 
 	// 以key作为文件名输出
 	filename: '[name].js',
 	// chunkhash 根据文件内容生成特点的hash，使用这个可以保证文件内容不变，那么文件名字就不会改变，可以用来作为热更新
 	chunkFilename: '[chunkhash].js'
 }
 ```

#### 4. [resolve](https://webpack.js.org/configuration/resolve/)

	Configure how modules are resolved. For example, when calling import "lodash" in ES2015, the resolve options can change where webpack goes to look for "lodash" (see modules).
	
	```js
	resolve: {
	    // 当你reuire时，不需要加上以下扩展名
	    extensions: ['.js', '.md', '.txt'],
	  },
```



#### 5. 插件(plugin)

	```js
	plugins: [
    // Webpack 2以后内置
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // 碰到错误warning但是不停止编译
    new webpack.NoEmitOnErrorsPlugin(),
    // 开发模式不需要压缩
    // new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
  ],
	```
#### 6. moudles

	* babel-loader(用来做js代码转化)
	* style-loader & css-loader(用来转化css代码)
	* less-loader 转化less文件
	* raw-loader 把文件当做普通的文本文件读取
	* json-loader webpack 2以后就不需要配置了（内置了）
	* url-loader 用来处理eot|woff|woff2|ttf|svg|png|jpg这些文件，可以防止加载资源文件导致页面加载缓慢
	* file-loader 用来处理文件，可以用url-loader代替，但是如果你资源文件是即时文件，那么就使用file-loader
