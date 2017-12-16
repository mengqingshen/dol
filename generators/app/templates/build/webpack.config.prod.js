const os = require('os')
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const CleanPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsParallelPlugin = require('webpack-uglify-parallel')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const merge = require('webpack-merge')
const WebpackMd5Hash = require('webpack-md5-hash')
const Visualizer = require('webpack-visualizer-plugin')

const webpackBaseConfig = require('./webpack.config.base.js')


const ROOT_PATH = path.resolve(__dirname, '../')
const BUILD_PATH = path.resolve(ROOT_PATH, 'public')

const data = JSON.parse(fs.readFileSync(path.resolve(ROOT_PATH, '.yo-rc.json'), 'utf-8'))['generator-dolphin']

const config = {
  devtool: 'source-map',
  output: {
    path: BUILD_PATH,
    publicPath: '//s3.meituan.net/v1/mss_c4375b35f5cb4e678b5b55a48c40cf9d/' + data.cdn.bucketName,
    filename: 'js/[name]-[hash].js',
    chunkFilename: 'js/[name]-[id].js'
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new CleanPlugin([BUILD_PATH]),
    new ExtractTextPlugin({
      filename: 'css/[name]-[contenthash].css',
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new UglifyJsParallelPlugin({
      workers: os.cpus().length,
      output: {
        ascii_only: true,
      },
      compress: {
        warnings: false,
      },
      sourceMap: false
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|zh-cn/),
    new WebpackMd5Hash(),
    new Visualizer()
  ],
  module: {
    rules: [{
      test: /\.module.css$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader?modules'
      })
    }, {
      test: /\.css/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      }),
      exclude: /\.module.css$/,
    }]
  }
}

module.exports = merge.smart(webpackBaseConfig, config)
