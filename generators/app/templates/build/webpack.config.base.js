const os = require('os')
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const AssetsPlugin = require('assets-webpack-plugin')
const HappyPack = require('happypack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const ROOT_PATH = path.resolve(__dirname, '../')
const APP_PATH = path.resolve(ROOT_PATH, 'src')
const BUILD_PATH = path.resolve(ROOT_PATH, 'public')
const MODULES_PATH = path.resolve(APP_PATH, 'modules')

const appJSON = JSON.parse(fs.readFileSync(path.resolve(ROOT_PATH, '.yo-rc.json'), 'utf-8'))['generator-rick']
const entries = require('../src/helpers/get-entries')()

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const getHtmlWebpackPlugins = entriesObj => Object.keys(entriesObj).map(entryName => new HtmlWebpackPlugin({
  chunks: ['common', 'vendor', entryName],
  title: appJSON.title[entryName],
  env: process.env.NODE_ENV,
  template: 'src/templates/default.ejs',
  filename: `html/${entryName}.html`,
  chunksSortMode: 'dependency'
}))

const modules = {
  common: path.resolve(MODULES_PATH, 'common.js'),
  vendor: ['react', 'react-dom', 'mobx', 'mobx-react', 'axios', 'moment']
}
const webpackBaseConfig = {
  context: ROOT_PATH,
  entry: Object.assign({}, entries, modules),
  output: {
    path: BUILD_PATH,
    publicPath: '/',
    filename: 'js/[name]-[hash].js',
    chunkFilename: 'js/[name]-[id]-[hash].js'
  },
  cache: true,
  resolve: {
    alias: {
      '@components': path.resolve(APP_PATH, 'components'),
      '@api': path.resolve(APP_PATH, 'api'),
      '@helpers': path.resolve(APP_PATH, 'helpers'),
      '@styles': path.resolve(APP_PATH, 'styles'),
      '@modules': path.resolve(APP_PATH, 'modules'),
      node_modules: path.resolve(ROOT_PATH, 'node_modules')
    },
    modules: [
      'src',
      path.resolve(ROOT_PATH, 'node_modules')
    ],
    extensions: ['.js', '.jsx', '.json', '.scss'],
    enforceExtension: false
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new AssetsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        // Useful to reduce the size of client-side libraries, e.g. react
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      cache: true,
      names: ['vendor'],
      filename: 'js/vendor-[hash].js'
    }),
    new HappyPack({
      threadPool: happyThreadPool,
      loaders: ['babel-loader?cacheDirectory'],
    }),
    ...getHtmlWebpackPlugins(entries)
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['happypack/loader'],
        exclude: /node_modules/,
        include: [
          path.join(APP_PATH),
          '/Users/mengqingshen/meituan/waimai_mfe_mrc/src'
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.scss$/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=10240'
      },
      {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
      }
    ]
  }
}

module.exports = webpackBaseConfig
