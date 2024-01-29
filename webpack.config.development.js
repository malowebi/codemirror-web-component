const { resolve } = require('path');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonWebpackConfig = require('./webpack.config.common.js');

const OUT_DIR = commonWebpackConfig.output.path;

process.env.NODE_ENV = 'development';
process.env.ANALYZER = process.env.ANALYZER && (parseInt(process.env.ANALYZER, 10) === 1);

module.exports = merge(commonWebpackConfig, { 
  mode: 'development', 
  devtool: 'cheap-module-source-map',
  devServer: {
    compress: true,
    port: 3000,
    host: '0.0.0.0'
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { context: resolve(__dirname, 'tasks', 'data'), from: 'index.html', to: OUT_DIR },
      ],
    }),
    new HtmlWebpackPlugin({
      inject: false,
      minify: false,
      chunks: ['index'],
      filename: `index.html`,
      chunksSortMode: 'manual',
      template: resolve(__dirname, 'tasks', 'data', 'index.html')
    })
  ]
});
