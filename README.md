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
6. 局部刷新，添加热替换配置（hot replace）
7. css文件抽离 
8. 公共文件抽取

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

1. [开发模式(devtool)](https://webpack.js.org/configuration/devtool/)  [demo]()

This option controls if and how source maps are generated.

开发建议使用eval模式，缺点是无法正确显示行号，想要正确显示行号，可以时候用source-map或者eval-source-map

生产环境： 建议使用cheap-module-source-map

2. 入口配置(entry)

```js
	string | [string] | object { <key>: string | [string] } | (function: () => string | [string] | object { <key>: string | [string] })
```

3. 输出配置(output)
4. resolve
5. 插件(plugin)
6. moudles

### 高级打包配置(打包多种文件)
### 多入口打包（生成1个bundlle.js）
### 多入口打多个包 （生成多个bundle.js）
### 兼容多浏览器，添加postcss-loader

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

	* [name] 默认文件没有名字的话，该值就等于id
	* [hash] 每次生成hash值都不一样
	* [chunkhash] 文件没有变化的话生成的hash值不变,可用来做热更新
	* [id] 内部的chunk id
	
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


