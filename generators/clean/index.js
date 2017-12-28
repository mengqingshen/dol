/**
 * @file the main file to work with `yo dolphin:clean` when trying to clean a page or a module. 12/15/2017
 * @author mengqingshen, mengqingshen_sean@outlook.com
 */
const Generator = require('yeoman-generator')
const fs = require('fs')

const {
  toFolderName,
  toFileName
} = require('../../utils/string-tools')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    // yo dolphin:clean [pageName] [[my-module-name]]
    this.argument('pageName', {
      type: pageName => toFolderName(pageName),
      desc: '页面名称（页面所在文件夹的名字）',
      required: true
    })

    this.argument('moduleName', {
      type: moduleName => toFileName(moduleName),
      desc: '模块文件名称',
      required: false
    })

    this.option('module', {
      desc: '模块类型',
      type: String,
      alias: 'm',
      default: 'page'
    })

    this.answers = {
      pageName: this.options.pageName,
      moduleName: this.options.moduleName,
      moduleType: this.options.module
    }

    this.moduleChoices = [
      {
        name: 'container',
        value: 'container',
      },
      {
        name: 'component',
        value: 'component'
      },
      {
        name: 'store',
        value: 'store'
      },
    ]
  }

  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'pageName',
        filter: moduleName => toFolderName(moduleName),
        message: '页面名称（页面所在目录名称）',
        default: this.answers.pageName,
        validate: (pageName) => {
          const pageFolderFullPath = this.destinationPath(`src/pages/${pageName}`)
          if (fs.existsSync(pageFolderFullPath)) {
            return true
          }
          return '没有找到对应的目录，请重新输入！'
        }
      },
      {
        type: 'confirm',
        name: 'isCleaningPage',
        default: true,
        message: '是否删除页面？',
        when: () => this.answers.moduleType === 'page'
      },
      {
        type: 'list',
        name: 'moduleType',
        message: '模块文件类型',
        default: this.answers.moduleType,
        validate: (moduleType) => {
          if (this.moduleChoices.map(({ value }) => value).includes(moduleType)) {
            return true
          }
          return `模块类型只能从 ${this.moduleChoices.map(({ value }) => value).includes(moduleType).join(', ')} 中选择！`
        },
        when: ({ isCleaningPage }) => !isCleaningPage || this.answers.moduleType !== 'page',
        choices: this.moduleChoices
      },
      {
        type: 'input',
        name: 'moduleName',
        message: '模块文件名称',
        filter: moduleName => toFileName(moduleName),
        default: this.answers.moduleName,
        validate: (moduleName, { pageName, moduleType }) => {
          const moduleFullPath = this.destinationPath(`src/pages/${pageName}/${moduleType}s/${moduleName}.js`)
          if (fs.existsSync(moduleFullPath)) {
            return true
          }
          return '没有找到对应的文件，请重新输入！'
        },
        when: ({ isCleaningPage }) => !isCleaningPage || this.answers.moduleType !== 'page',
      },
      {
        type: 'confirm',
        name: 'isCleaningModule',
        message: '是否删除模块？',
        when: ({ moduleType }) => this.moduleChoices.map(({ value }) => value).includes(moduleType),
      }
    ]).then((answers) => {
      Object.assign(this.answers, answers)
    })
  }

  writing() {
    if (this.answers.isCleaningPage) this._cleanPage()
    if (this.answers.isCleaningModule) this._cleanModule()
  }

  install() {}

  end() {
    if (this.answers.isCleaningPage && this.answers.moduleType === 'page') {
      const config = this.config.getAll()
      delete config.title[this.answers.pageName]

      delete config.path[this.answers.pageName]

      this.config.set(config)
    }
  }

  _cleanPage() {
    const pageFolderFullPath = this.destinationPath(`src/pages/${this.answers.pageName}`)
    const apiPathOfThePage = this.destinationPath(`src/apis/${this.answers.pageName}.js`)
    this.fs.delete(pageFolderFullPath)
    this.fs.delete(apiPathOfThePage)
  }

  _cleanModule() {
    const moduleFileFullPath = this.destinationPath(`src/pages/${this.answers.pageName}/${this.answers.moduleType}s/${this.answers.moduleName}.js`)
    this.fs.delete(moduleFileFullPath)
  }
}
