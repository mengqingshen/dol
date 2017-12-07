/**
 * @author mengqingshen, mengqingshen_sean@outlook.com
 * @file Some handly tools to operate string. 12/07/2017
 */
module.exports = {
  folderNameToFileName: folderName => folderName.replace('_', '-'),
  isFileName: fileName => /[a-z]+(-[a-z])*/.test(fileName),
  toFileName: name => name.replace(/([A-Z])/g, '-$1').toLowerCase(),
  isFolderName: folderName => /[a-z]+(_[a-z])*/.test(folderName),
  toFolderName: name => name.replace(/([A-Z])/g, '_$1').toLowerCase()
}
