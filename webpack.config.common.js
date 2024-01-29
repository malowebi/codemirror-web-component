const { join, resolve } = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const VERSION   = require('./package.json').version;
const ANALYZER  = process.env.ANALYZER || undefined;
const NODE_ENV  = process.env.NODE_ENV || 'development';
const IS_DEV    = (NODE_ENV === 'development');
const IS_PROD   = (NODE_ENV === 'production');
const OUT_DIR   = join(__dirname, 'dist');

const commonWebpackConfig = {
  mode: NODE_ENV,
  devtool: IS_PROD ? 'source-map' : 'cheap-module-source-map',
  stats: {
    colors: true,
    warnings: false,
    children: false,
    assets: false,
    chunkModules: false,
    modules: false,
    errorDetails: true,
    children: true
  },
  entry: {
    codemirror: './src/index.ts'
  },
  output: {
    path: OUT_DIR,
    filename: '[name].js',
    // chunkFilename: ({ chunk }) => {
    //   return (chunk.name === 'sw') ? 'sw.js' : `[name].js?v=[contenthash]`;
    // },
  },
  module: {
    rules: [
      // -- (JS|TS) loader ----------------------------------------------------
      {
        test: /\.(js|ts)$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      // -- CSS loader --------------------------------------------------------
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, ...[
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: (loader) => [
                  require('postcss-import')({ root: loader.resourcePath }),
                  require('postcss-preset-env')({ browsers: 'last 2 versions' }),
                  ...(IS_DEV ? [] : [require('cssnano')()]),
                ],
              },
            },
          },
        ]],
      }
    ],
  },
  resolve: {
    modules: [__dirname, "src", "node_modules"],
    extensions: [".js", ".ts"],
  },
  plugins: [
    new CleanWebpackPlugin(), 
    new MiniCssExtractPlugin({ filename: `[name].css` }),
  ]
};

if (ANALYZER) {
  commonWebpackConfig.plugins.unshift(new BundleAnalyzerPlugin({
    openAnalyzer: false,
    analyzerMode: 'static',
    generateStatsFile: true,
    statsFilename: resolve(__dirname, 'dist', 'report', 'stats.json'),
    reportFilename: resolve(__dirname, 'dist', 'report', 'report.html'),
    statsOptions: { chunkModules: true, children: false, source: false },
  }));
}

module.exports = commonWebpackConfig;
