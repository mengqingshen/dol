/**
 * @file the main file to work with `yo dolphin` when trying to init your project. 12/04/2017
 * @author mengqingshen, mengqingshen_sean@outlook.com
 */

const fs = require('fs')
const path = require('path')
const moment = require('moment')
const shell = require('shelljs')
const Generator = require('yeoman-generator')

const {
  DOLPHIN,
  ABOUT_WORK,
  ENJOY
} = require('../../utils/awsome-words')


module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    // 脚手架本身用到了 ejs 语法，生成的项目本身可能也会有 ejs 模版，为了避免冲突，采用不同的 ejs 定界符。
    this.tplSettings = {
      delimiter: '$'
    }

    // yo dolphin [appName]
    this.argument('appName', { type: String, desc: '项目名字', required: false })

    this.answers = {
      appCreateDate: moment().format('MM/DD/YYYY')
    }
  }

  initializing() {
    this.log(DOLPHIN)
    this.log(ABOUT_WORK)
  }

  prompting() {
    return this.prompt([
      {
        type: 'confirm',
        name: 'isUnderTheAppRootDir',
        message: '没提供项目名称，是否当前是在创建好的项目的顶级目录下？',
        when: () => this.options.appName === undefined,
        default: () => true
      },
      {
        type: 'input',
        name: 'appName',
        message: '项目名称（将作为项目文件夹名称）',
        default: ({ isUnderTheAppRootDir }) => (
          isUnderTheAppRootDir === false
            ? undefined
            : (this.options.appName || this.destinationPath().split('/').pop())
        ),
        validate: (appName) => {
          if (!appName) {
            return '项目名称不可以为空！'
          }
          return true
        }
      },
      {
        type: 'input',
        name: 'appDesc',
        message: '项目描述'
      },
      {
        type: 'input',
        name: 'appAuthorName',
        message: '项目创建者',
        store: true
      },
      {
        type: 'input',
        name: 'appAuthorEmail',
        message: '项目创建者电子邮箱',
        store: true
      },
      {
        type: 'input',
        name: 'appVersion',
        message: '项目版本号',
        default: '1.0.0',
        store: true
      },
      {
        type: 'input',
        name: 'deployTargetDir',
        message: 'PLUS 持续交付部署路径'
      },
      {
        type: 'input',
        name: 'devServerHost',
        message: '开发环境的地址（比如: http://dev.example.com）',
        store: true,
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
    // 将新创建的项目目录作为脚手架项目的根目录（默认是执行 yo dolphin [appName] 时所在的目录）
    if (this.answers.isUnderTheAppRootDir !== true) {
      this.destinationRoot(this.answers.appName)
    }

    // 在根目录生成 .yo-rc.json , 确保后续命令都能知道根目录
    // this.config.save()

    // 初始化 .yo-rc.json
    this.config.set({
      cdn: {
        bucketName: this.answers.cdnBucketName,
        accessKeyId: this.answers.cdnAccessKeyId,
        secretAccessKey: this.answers.cdnSecretAccessKey
      },
      title: {},
      path: {},
      proxy: {
        api: (() => {
          if (/^https?\/\/.*/.test(this.answers.devServerHost)) {
            return {
              rule: [],
              options: {
                target: this.answers.devServerHost,
                changeOrigin: true,
                logLevel: 'debug'
              }
            }
          }
          return null
        })(),
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
        shell.exec(`mkdir -p ${fullPathOfDestination}`)

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
    this.npmInstall()
  }

  end() {
    this.spawnCommand('npm', ['start'])
    this.log(ENJOY)
  }
}
