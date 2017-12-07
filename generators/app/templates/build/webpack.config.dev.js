const webpack = require('webpack')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.config.base.js')

const webpackConfig = {
  resolve: {
    alias: {
      '@mfe/mrc/Row': '/Users/mengqingshen/meituan/waimai_mfe_mrc/src/Grid/Row',
      '@mfe/mrc/Col': '/Users/mengqingshen/meituan/waimai_mfe_mrc/src/Grid/Col',
      '@mfe/mrc': '/Users/mengqingshen/meituan/waimai_mfe_mrc/src',
      src: '/Users/mengqingshen/meituan/waimai_mfe_mrc/src',
    }
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [{
      test: /\.module.css$/,
      loader: 'style-loader!css-loader?modules&localIdentName=[path][name]---[local]'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader',
      exclude: /\.module.css$/,
    }]
  }
}

module.exports = merge.smart(webpackBaseConfig, webpackConfig)
