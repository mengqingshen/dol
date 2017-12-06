/**
 * @author mengqingshen, mengqingshen_sean@outlook.com
 * @file the main file to work with `yo rick` when trying to init your project. 12/04/2017
 */

const fs = require('fs')
const path = require('path')
const moment = require('moment')
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
    this.tplSettings = {
      open: '{',
      close: '}'
    }

    this.argument('appName', { type: String, desc: '项目名字', required: true })

    this.answers = {
      appCreateDate: moment().format('MM/DD/YYYY')
    }
  }

  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'appName',
        message: '名称',
        default: this.options.appName
      },
      {
        type: 'input',
        name: 'appDesc',
        message: '描述',
        defult: ''
      },
      {
        type: 'input',
        name: 'appAuthorName',
        message: '作者',
        store: true
      },
      {
        type: 'input',
        name: 'appAuthorEmail',
        message: '邮箱',
        store: true
      },
      {
        type: 'input',
        name: 'appVersion',
        message: '版本',
        default: '1.0.0',
        store: true
      },
      {
        type: 'input',
        name: 'cdnBucketName',
        message: 'CDN bucketName',
        default: this.options.appName,
      },
      {
        type: 'input',
        name: 'cdnAccessKeyId',
        message: 'CDN accessKeyId',
        default: '',
      },
      {
        type: 'input',
        name: 'cdnSecretAccessKey',
        message: 'CDN secretAccessKey',
        default: '',
      },
    ]).then((answers) => {
      Object.assign(this.answers, answers)
    })
  }

  writing() {
    const copyDirAsTpl = (fullPathOfSource, fullPathOfDestination) => {
      fs.readdir(fullPathOfSource, (err, items) => items.forEach(((filePath) => {
        const fullPathOfItemSource = path.join(fullPathOfSource, filePath)
        const fullPathOfItemDestination = path.join(fullPathOfDestination, filePath)
        fs.stat(fullPathOfItemSource, (error, stat) => {
          if (stat.isFile()) {
            this.fs.copyTpl(fullPathOfItemSource, fullPathOfItemDestination, this.answers, this.tplSettings)
          }

          if (stat.isDirectory()) {
            copyDirAsTpl(fullPathOfItemSource, fullPathOfItemDestination)
          }
        })
      })))
    }

    const SOURCE_ROOT = this.templatePath()
    const DESTINATION_ROOT = this.destinationRoot(this.options.appName)

    copyDirAsTpl(SOURCE_ROOT, DESTINATION_ROOT)
  }

  install() {
    this.spawnCommand('cd', [this.options.appName])

    this.npmInstall()
  }

  end() {
    this.spawnCommand('npm', ['start'])
  }
}
