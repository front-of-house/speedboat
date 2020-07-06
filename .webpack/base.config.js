const path = require('path')
const { readEnv } = require('read-env')
const webpack = require('webpack')

const cwd = process.cwd()
const { NODE_ENV } = process.env

module.exports = {
  output: {
    libraryTarget: 'commonjs2',
    filename: '[name].js'
  },
  mode: NODE_ENV === 'production' ? 'production' : 'development',
  target: 'node',
  node: {
    console: false,
    global: true,
    process: true,
    __filename: true,
    __dirname: true,
    Buffer: true,
    setImmediate: true
  },
  performance: { hints: false },
  devtool: 'inline-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    alias: {
      '@': cwd
    },
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  plugins: [new webpack.DefinePlugin(readEnv('PUBLIC'))],
  optimization: {
    minimize: false
  },
  externals: {
    knex: 'knex',
    bookshelf: 'bookshelf',
    pg: 'pg'
  }
}
