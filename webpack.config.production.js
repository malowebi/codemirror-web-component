const { merge } = require('webpack-merge');
const commonWebpackConfig = require('./webpack.config.common.js');

process.env.NODE_ENV = 'production';
process.env.ANALYZER = process.env.ANALYZER && (parseInt(process.env.ANALYZER, 10) === 1);

module.exports = merge(commonWebpackConfig, {
  mode: 'production', 
  devtool: 'source-map'
});
