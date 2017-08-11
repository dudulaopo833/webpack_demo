# Webpack3 配置详解

```js
demo
|       _ a.js
|-src---|_ b.js
|       |_ c.js
|=webpack.config.js
```

## 一、打包升级
1. [基础打包配置]()
2. 高级打包配置(打包多种文件)
3. 多入口打包（生成1个bundlle.js）
4. 多入口打多个包 （生成多个bundle.js）
5. 兼容多浏览器，添加postcss-loader
6. css文件抽离 
7. 公共文件抽取
7. 局部刷新，添加热替换配置（hot replace）


5. multi compl热替换配置
6. css文件抽取
6. common chunk配置
7. dll 配置
8. 构建速度 vendor
4. 构建速度(动态构建，只加载)
5. 编译速度
6. 减少包体积
7. 减少bundle.js体积
8. 减少重复下载
9. 增量更新
10. 代码分离

### 基础打包配置

1. __[开发模式(devtool)](https://webpack.js.org/configuration/devtool/)__  

	[demo](https://github.com/chenzhiwei199/webpack_demo/tree/master/webpack.config.base)
	
	This option controls if and how source maps are generated.
	
	开发建议使用eval模式，缺点是无法正确显示行号，想要正确显示行号，可以时候用source-map或者eval-source-map
	
	生产环境： 建议使用cheap-module-source-map

2. __入口配置(entry)__

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

3. __输出配置(output)__

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

4. [resolve](https://webpack.js.org/configuration/resolve/)

	Configure how modules are resolved. For example, when calling import "lodash" in ES2015, the resolve options can change where webpack goes to look for "lodash" (see modules).
	
	```js
	resolve: {
	    // 当你reuire时，不需要加上以下扩展名
	    extensions: ['.js', '.md', '.txt'],
	  },
```



5. 插件(plugin)

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
6. moudles

	* babel-loader(用来做js代码转化)
	* style-loader & css-loader(用来转化css代码)
	* less-loader 转化less文件
	* raw-loader 把文件当做普通的文本文件读取
	* json-loader webpack 2以后就不需要配置了（内置了）
	* url-loader 用来处理eot|woff|woff2|ttf|svg|png|jpg这些文件，可以防止加载资源文件导致页面加载缓慢
	* file-loader 用来处理文件，可以用url-loader代替，但是如果你资源文件是即时文件，那么就使用file-loader

### 高级打包配置(添加)
### 多入口打多个包 （生成多个bundle.js）

这个是webpack 3.1.0新出来的配置方式,可以用来解决多个入口文件，打包成多个文件夹的问题。

[demo 将多个入口打成多个文件夹 ](https://github.com/chenzhiwei199/webpack_demo/tree/master/webpack.config.multi_compiler)

```js
module.exports = [{
  output: {
    filename: './dist-amd.js',
    libraryTarget: 'amd'
  },
  entry: './app.js',
}, {
  output: {
    filename: './dist-commonjs.js',
    libraryTarget: 'commonjs'
  },
  entry: './app.js',
}]
```
### 兼容多浏览器，添加postcss-loader

[demo](https://github.com/chenzhiwei199/webpack_demo)

添加postcss-loader，需要做如下配置
###### webpack config 配置
插件配置

```diff
    {
        test: /\.less/,
        use: [
          'style-loader',
          'css-loader',
+          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.css$/,
-        use: 'style-loader!css-loader',
+        use: 'style-loader!css-loader!postcss-loader',
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


### css文件抽离 


[demo](https://github.com/chenzhiwei199/webpack_demo/tree/master/webpack.config.extractText)

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

### 公共文件抽取

公共文件抽取一般依靠 CommonChunkPlguin 和 Dllplugin这两个插件.

[CommonChunkPlugin Demo](https://github.com/chenzhiwei199/webpack_demo/tree/master/webpack.config.commonchunk)

[DllPlugin Demo](https://github.com/chenzhiwei199/webpack_demo/tree/master/webpack.config.dll)
- 共同点：

	- 都可以抽出公共模块
- 不同点：

	- CommonChunkPlguin
	
		1. CommonChunkPlguin可以抽出多个模块间公共模块
		2. 配置了HtmlWebpackPlugin后，不需要手动在html中导入
	- dllPlugin

		1. dllPlugin 可以在multi compliler（多个webpack config 文件） 中使用
		2. dllPlugin 生成的文件相当于独立的存在，就像jQuery一样，需要你在html进行引入之后才能使用。

CommonChunkPlugin 配置: 

```js
  // 如果有其他CommonsChunkPlugin生成的文件，将会引入
  // - If chunk has the name as specified in the chunkNames it is put in the list
  // - If no chunk with the name as given in chunkNames exists a new chunk is created and added to the list
 // 大概意思就是如果name在entry里面有，那就加入一个列表，如果entry里面没有，
 // 那么就创建一个新chunk列表,如果chunks里面相同模块代码出现次数超过minChunks,那就添加到这个新创建的list里面。
 new webpack.optimize.CommonsChunkPlugin({
      name: "common",
      chunks: ["a", "b"], //需要合并的文件
      // minChunks:3 //最少在出现过多少次才将其打入common中
    }),
    //如果
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity 
    })
```

DllPlugin 配置：

```js
添加文件
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


### 文件分析


---

## 二、配置详解
### 1.context配置

example：该配置会设置当前的默认路径，import时会以改该路径作为相对路径的根路径

```js
path.resolve(__dirname, "src")
```

### 2.entry
######官网给出
```js
	string | [string] | object { <key>: string | [string] } | (function: () => string | [string] | object { <key>: string | [string] })
```

这里可以传入 string , string 数组, 对象(key, value)， function(return string)


* 单入口

	* `entry: [path.resolve(__dirname, 'src/a.js')]`
	
	
* 多入口配置

	这里的key可以在output中配置给输出文件[name]

	```js
		entry: {
	    a: path.resolve(__dirname, 'src/a.js'),
	    b: path.resolve(__dirname, 'src/b.js')
	  }
	```

	
### 3.Output

* chunkFilename 配置生成的chunk文件的名字

	+ [name] 默认文件没有名字的话，该值就等于id
	- [hash] 每次生成hash值都不一样
	- [chunkhash] 文件没有变化的话生成的hash值不变,可用来做热更新
	- [id] 内部的chunk id
	
* Filename 配置生成的chunk文件的名字
### 4.Moudle
* rules(常用loader)

	webpack版本升级点：
	###### 1. loaders更名为rules
	###### 2. loader 更名为use
	###### 3. style-loader必须写全，最好不使用style
	```diff
        module: {
            loaders: {
	+         rules: {
		          test: /\.less$/,
    -          loader: "style-loader!css-loader!less-loader"
	+         use: [
	+               "style-loader",
	+               "css-loader",
	+               "less-loader"
	+         ]
		    }
		  }
	```
	
	```diff
	  module: {
	    rules: [
	      {
	        use: [
	-         "style", // 请勿再省略'-loader'
	+         "style-loader",
	-         "css",
	+         "css-loader",
	-         "less",
	+         "less-loader",
	        ]
	      }
	    ]
	  }
	```
	rule通常有5个属性需要配置，test,inculde,exclude,resource,issuer,通常只配置test,inculde,exclude
	* __babel-loader__
		
		* 1.`npm install --save-dev babel-core babel-preset-es2015`
		* 2.` npm install --save-dev babel-loader`
		* 3.创建文件 .babelrc  
		preset =>  pre set 预设转码，配置规则参考[Babel 入门教程](http://www.ruanyifeng.com/blog/2016/01/babel.html)

		插件配置[其他插件](http://babeljs.cn/docs/plugins/)
		
		* 1.[babel-plugin-add-module-exports](https://github.com/59naga/babel-plugin-add-module-exports)

		
		This plugin follows the babel@5 behavior - add the 		module.exports if only the export default declaration exists.
		
		```js
	'use strict';
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = 'foo';
	// 这个插件遵循了babel@5的行为，下面这个就是babel@5的行为，当一个文件只有export default的时候，会将这个default直接exports出去。
	module.exports = exports['default'];
		```
		
		* 2.[babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy)

		这是Babel 6的一个插件，用于复制Babel 5的旧装饰器行为，以便让人们更容易地过渡到Babel 6
		
		* 3.[babel-plugin-transform-object-assign](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-object-assign)
		
		ie兼容
		
		```js
		Object.assign(a, b);
		```
		
		into 
		
		```js
		var _extends = ...;
 
		_extends(a, b);		
		```

	* __json-loader__（webpack 2 之后已经默认配置，所以可以不配置）

		json-loader的作用
		
		/xx.json =>  json-loader!./xx.json
		
		["a","b","c"] => module.exports = ["a","b","c"]
		
		source code
		
		```js
		{
	        test: /\.json$/,
	        use: 'json-loader',
      	}
		```
	
	* __raw-loader__

		source code 
	
		```js
		 {
	        test: /\.txt$/,
	        use: 'raw-loader'
	    }
		```
	* __style-loader & css-loader & less-loader & sass-loader & postcss-loader__

		* 转化css文件
		
			```js
			{
		        test: /\.css$/,
		        use: [
		          'style-loader',
		          'css-loader',
		        ]
     	   }
			```
		* 转化less文件(sass同less，将less-loader替换为sass-loader)
		
			```js
			{
		        test: /\.less/,
		        use: [
		          'style-loader',
		          'css-loader',
		          'less-loader'
		        ]
	      }
			```
		* postcss-loader 使用来设置自动补全的
			1.创建文件postcss.config.js
			
			```js
				module.exports = {
				 	 plugins: {
				    'postcss-import': {}, //能够使用import语法 @import "cssrecipes-defaults";
				    'postcss-cssnext': {}, //PostCSS-cssnext是一个PostCSS插件，可以帮助您使用最新的CSS语法。 它将CSS规范转换为更兼容的CSS，因此您不需要等待浏览器支持。
				    'autoprefixer': {},
				    'cssnano': {} //可以最大程度的压缩css
				  }
				}
				上面都可以通过在package.json中设置
				"browserslist": [
				    "> 1%",
				    "last 2 versions"
				  ]
				 来控制需要兼容的浏览器类型及版本
			```
		* postcss-loader 配合 ExtractTextPlugin
	* __url-loader__

		```js
		 {
	        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
	        loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
         }
		```

### 5.Resolve
### 6.Plugins
#### OccurrenceOrderPlugin内置加入，不需要配置
#### ExtractTextPlugin
```diff
	plugins: [
-  		new ExtractTextPlugin("bundle.css", { allChunks: true, disable: false })
+ 	   new ExtractTextPlugin({
+     filename: "bundle.css",
+     disable: false,
+     allChunks: true
+     })
	]
```
#### [DefinePlugin](https://webpack.js.org/plugins/define-plugin/)
定义一些默认值
```js
new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(true),
  VERSION: JSON.stringify("5fa3b9"),
  BROWSER_SUPPORTS_HTML5: true,
  TWO: "1+1",
  "typeof window": JSON.stringify("object")
})
```
#### [UglifyJsPlugin](https://webpack.js.org/plugins/uglifyjs-webpack-plugin/)
	用于压缩webpack打包的js文件
	```js
	  uglifyOptions: {
	      ie8: false,
	      ecma: 8,
	      output: {
	        comments: false,
	        beautify: false,
	      },
	      compress: {...options},
	      warnings: false  //是否显示warning
	    }
	  })
	```
#### BannerPlugin
输出的文件头部添加注释信息


