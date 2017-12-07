/**
 * @author mengqingshen, mengqingshen_sean@outlook.com
 * @file the main file to work with `yo rick` when trying to init your project. 12/04/2017
 */

const fs = require('fs')
const path = require('path')
const moment = require('moment')
const Generator = require('yeoman-generator')

const {
  RICK,
  ABOUT_WORK,
  ENJOY,
} = require('../../utils/awsome-words')


module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    // 脚手架本身用到了 ejs 语法，生成的项目本身可能也会有 ejs 模版，为了避免冲突，采用不同的 ejs 定界符。
    this.tplSettings = {
      delimiter: '$'
    }

    // yo rick [appName]
    this.argument('appName', { type: String, desc: '项目名字', required: false })

    this.answers = {
      appCreateDate: moment().format('MM/DD/YYYY')
    }
  }

  initializing() {
    this.log(RICK)
    this.log(ABOUT_WORK)
  }

  prompting() {
    return this.prompt([
      {
        type: 'confirm',
        name: 'isUnderTheAppRootDir',
        message: 'no name provided. You are already under the root of the app ?',
        when: () => this.options.appName === undefined,
        default: () => true
      },
      {
        type: 'input',
        name: 'appName',
        message: 'name of the app',
        default: this.options.appName || this.destinationPath().split('/').pop()
      },
      {
        type: 'input',
        name: 'appDesc',
        message: 'description of the app',
        defult: ''
      },
      {
        type: 'input',
        name: 'appAuthorName',
        message: 'your name',
        store: true
      },
      {
        type: 'input',
        name: 'appAuthorEmail',
        message: 'your email',
        store: true
      },
      {
        type: 'input',
        name: 'appVersion',
        message: 'version of the app',
        default: '1.0.0',
        store: true
      },
      {
        type: 'input',
        name: 'cdnBucketName',
        message: 'CDN bucketName',
        store: true
      },
      {
        type: 'input',
        name: 'cdnAccessKeyId',
        message: 'CDN accessKeyId',
        store: true
      },
      {
        type: 'input',
        name: 'cdnSecretAccessKey',
        message: 'CDN secretAccessKey',
        store: true
      },
    ]).then((answers) => {
      Object.assign(this.answers, answers)
    })
  }

  configuring() {
    // 将新创建的项目目录作为脚手架项目的根目录（默认是执行 yo rick [appName] 是所在的目录）
    if (!this.answers.isUnderTheAppRootDir) {
      this.destinationRoot(this.options.appName)
    }

    // 在根目录生成 .yo-rc.json , 确保后续命令都能知道根目录
    this.config.save()

    // 初始化 .yo-rc.json
    this.config.save({
      cdn: {
        bucketName: this.answers.cdnBucketName,
        accessKeyId: this.answers.cdnAccessKeyId,
        secretAccessKey: this.answers.cdnSecretAccessKey
      },
      title: {},
      path: {},
      proxy: {
        api: {
          rule: [],
          options: {
            target: '',
            changeOrigin: true,
            logLevel: 'debug'
          }
        },
        static: {
          rule: ['**/*.html', '**/*.js', '**/*.css'],
          options: {
            target: 'http://localhost:3001',
            changeOrigin: true,
            logLevel: 'debug'
          }
        }
      }
    })
  }

  writing() {
    /**
     * @description 将 template 下的所有文件都复制过去，并对文件进行 ejs render
     * @param {*} fullPathOfSource 
     * @param {*} fullPathOfDestination 
     */
    const copyDirAsTpl = (fullPathOfSource, fullPathOfDestination) => {
      fs.readdir(fullPathOfSource, (err, items) => {
        // 目录无法直接复制，创建之
        this.spawnCommandSync('mkdir', [fullPathOfDestination])

        // 如果是空目录，就不向下递归了
        if (!items || !items[0]) {
          return
        }

        items.forEach(((filePath) => {
          const fullPathOfItemSource = path.join(fullPathOfSource, filePath)
          const fullPathOfItemDestination = path.join(fullPathOfDestination, filePath)
          fs.stat(fullPathOfItemSource, (error, stat) => {
            if (stat.isFile()) {
              // 假定 templates 下的每个文件都有可能用到了 ejs 语法，因此针对每个文件都使用 copyTpl 函数。
              this.fs.copyTpl(fullPathOfItemSource, fullPathOfItemDestination, this.answers, this.tplSettings)
            }

            if (stat.isDirectory()) {
              copyDirAsTpl(fullPathOfItemSource, fullPathOfItemDestination)
            }
          })
        }))
      })
    }

    const SOURCE_ROOT = this.templatePath()
    const DESTINATION_ROOT = this.destinationPath()

    copyDirAsTpl(SOURCE_ROOT, DESTINATION_ROOT)
  }

  install() {
    this.spawnCommand('cd', [this.options.appName])

    this.npmInstall()
    this.log(ENJOY)
  }

  end() {
    this.spawnCommand('npm', ['start'])
  }
}
