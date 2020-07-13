const path = require('path')
const match = require('matched')
const base = require('./base.config.js')

const cwd = process.cwd()

module.exports = {
  ...base,
  output: {
    ...base.output,
    path: path.join(cwd, 'build/functions')
  },
  entry: match
    .sync(path.join(cwd, '/api/routes/**/*'), { ignore: ['**/__tests__/**'] })
    .reduce((entries, file) => {
      return {
        ...entries,
        [path.basename(file).split('.')[0]]: file
      }
    }, {})
}
