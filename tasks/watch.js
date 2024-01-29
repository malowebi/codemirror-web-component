#!/usr/bin/env node

const express = require('express');
const { resolve } = require('path');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

const NODE_HTTP_PORT = process.env.NODE_HTTP_PORT || '8080';
const NODE_HTTP_HOST = process.env.NODE_HTTP_HOST || 'localhost';
const WEBPACK_CONFIG = require('../webpack.config.development');

const devCompiler = webpack(WEBPACK_CONFIG);
const watchServer = express();

watchServer.use(devMiddleware(devCompiler, {
  publicPath: '',
  stats: {
    colors: true,
    chunks: false,
    assets: false,
    chunkModules: false,
    modules: false,
    children: false,
    cached: false,
    reasons: false,
    source: false,
    chunkOrigins: false
  }
}));

watchServer.use(hotMiddleware(devCompiler));

watchServer.listen(
  NODE_HTTP_PORT, 
  NODE_HTTP_HOST, 
  () => console.log(`HTTP server started: http://${NODE_HTTP_HOST}:${NODE_HTTP_PORT}`)
);
