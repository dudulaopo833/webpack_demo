module.exports = {
//   parser: 'sugarss',
  plugins: {
    'postcss-import': {}, // 能够使用import语法 @import "cssrecipes-defaults"; 
    'postcss-cssnext': {}, //PostCSS-cssnext是一个PostCSS插件，可以帮助您使用最新的CSS语法。 它将CSS规范转换为更兼容的CSS，因此您不需要等待浏览器支持。
    // 'autoprefixer': {},
    'cssnano': {}
  }
}