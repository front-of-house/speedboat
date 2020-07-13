const path = require('path')
const base = require('./base.config.js')

const cwd = process.cwd()

module.exports = {
  ...base,
  output: {
    ...base.output,
    path: path.join(cwd, 'build/functions')
  },
  entry: {
    appServer: path.join(cwd, '/app/appServer.tsx')
  }
}
