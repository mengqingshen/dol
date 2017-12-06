/**
 * @author <$= appAuthorName $>, <$= appAuthorEmail $>
 * @file Generate entries automatically by filename called entry.js for webpack to build. <$= appCreateDate $>
 */

const glob = require('glob')
const path = require('path')
const fs = require('fs')
const log = require('npmlog')

const inputEntryStr = process.env.ENTRIES
const isDev = process.env.NODE_ENV === 'development'

function filterEntries(short) {
  const pathStr = path.join(__dirname, '../pages', short, 'entry.js')
  const isExist = fs.existsSync(pathStr)
  if (!isExist) log.warn(`文件不存在：${pathStr}`)
  return isExist
}

module.exports = function () {
  let files
  // 只有在debug下生效
  if (inputEntryStr && isDev) {
    const splits = inputEntryStr.split(',')
    files = splits.filter(filterEntries).map(short => path.join(short, 'entry.js'))
  } else {
    const entries = glob
      .sync('**/entry.js', {
        cwd: path.join(__dirname, '../pages')
      })
      .map(str => str.replace('/entry.js', ''))
    files = entries.map(str => path.join(str, 'entry.js'))
  }

  return files.reduce((map, file) => {
    const key = file.replace('/entry.js', '').replace(/\//g, '.')
    map[key] = isDev ?
      [
        'webpack-hot-middleware/client?path=http://localhost:3001/__webpack_hmr',
        `./src/pages/${file}`
      ] :
      ['babel-polyfill', `./src/pages/${file}`]
    return map
  }, {})
}
