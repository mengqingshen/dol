/**
 * @author mengqingshen, mengqingshen_sean@outlook.com
 * @file the main file to work with `yo rick:page` when trying to create a new page. 12/04/2017
 */

const fs = require('fs')
const path = require('path')
const moment = require('moment')
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    // 脚手架本身用到了 ejs 语法，生成的项目本身可能也会有 ejs 模版，为了避免冲突，采用不同的 ejs 定界符。
    this.tplSettings = {
      delimiter: '$'
    }

    // yo rick:page [pageName]
    this.argument('pageName', { type: String, desc: '页面名字', required: true })

    this.answers = {
      pageCreateDate: moment().format('MM/DD/YYYY'),
      pageRootClassName: this.options.pageName.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase()
    }
  }

  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'pageTitle',
        message: 'title of the page',
        defult: ''
      },
      {
        type: 'input',
        name: 'pagePath',
        message: 'the path of the page',
        defult: ''
      },
      {
        type: 'checkbox',
        name: 'pageDataFlowPlan',
        default: 'mobx',
        message: 'plan of data flow',
        choices: [
          {
            name: 'mobx',
            value: 'mobx',
            checked: true
          },
          {
            name: 'redux',
            value: 'redux'
          },
          {
            name: 'none',
            value: 'none'
          },
        ]
      },
      {
        type: 'input',
        name: 'pageAuthorName',
        message: 'your name',
        store: true
      },
      {
        type: 'input',
        name: 'pageAuthorEmail',
        message: 'your email',
        store: true
      },
    ]).then((answers) => {
      Object.assign(this.answers, answers, { pageName: this.options.pageName })
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

    const SOURCE_ROOT = this.templatePath(this.answers.pageDataFlowPlan[0])
    const DESTINATION_ROOT = this.destinationPath(`src/pages/${this.answers.pageName}`)

    copyDirAsTpl(SOURCE_ROOT, DESTINATION_ROOT)
  }

  install() {}

  end() {
    const config = this.config.getAll()
    config.title[this.answers.pageName] = this.answers.pageTitle

    config.path[this.answers.pageName] = this.answers.pagePath

    this.config.set(config)
  }
}
