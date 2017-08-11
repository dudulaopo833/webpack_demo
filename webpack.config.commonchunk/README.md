### 1. 启动

`webpack-dev-server --config webpack.config.commonchunk`

### 2. 如何配置

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

