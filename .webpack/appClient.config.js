const path = require('path')
const base = require('./base.config.js')

const cwd = process.cwd()

delete base.target
delete base.node
delete base.optimization
delete base.externals

module.exports = {
  ...base,
  output: {
    path: path.join(cwd, 'build/app/static')
  },
  entry: {
    appClient: path.join(cwd, '/app/appClient.tsx')
  }
}
