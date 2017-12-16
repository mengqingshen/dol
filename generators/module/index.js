/**
 * @author mengqingshen, mengqingshen_sean@outlook.com
 * @file the main file to work with `yo dolphin:module` when trying to create a new module. 12/16/2017
 */

const Generator = require('yeoman-generator')
const fs = require('fs')
const moment = require('moment')

const {
  toFolderName,
  toFileName
} = require('../../utils/string-tools')


module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.tplSettings = {
      delimiter: '$'
    }

    this.argument('pageName', {
      type: pageName => toFolderName(pageName),
      desc: '页面名称（页面所在文件夹的名字）',
      required: true
    })

    this.argument('moduleName', {
      type: moduleName => toFileName(moduleName),
      desc: '模块文件名称',
      required: true
    })

    this.option('module', {
      type: moduleName => toFileName(moduleName),
      alias: 'm',
      desc: '模块文件名称',
      default: 'component'
    })

    this.answers = {
      pageName: this.options.pageName,
      moduleName: this.options.moduleName,
      moduleType: this.options.module,
      moduleCreateDate: moment().format('MM/DD/YYYY')
    }

    this.moduleChoices = [
      {
        name: 'component',
        value: 'component'
      },
      {
        name: 'container',
        value: 'container',
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
        message: '页面名称（页面所在目录名称）',
        filter: moduleName => toFolderName(moduleName),
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
        type: 'input',
        name: 'moduleName',
        message: '模块文件名称',
        default: this.answers.moduleName,
        validate: (moduleName, { pageName, moduleType }) => {
          const moduleFullPath = this.destinationPath(`src/pages/${pageName}/${moduleType}s/${moduleName}.js`)
          if (!fs.existsSync(moduleFullPath)) {
            return true
          }
          return '该文件已存在，如要覆盖，请先通过 yo dolphin:clean 删除该文件！'
        },
        filter: moduleName => toFileName(moduleName),
        when: ({ isCleaningPage }) => !isCleaningPage || this.answers.moduleType !== 'page',
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
        choices: this.moduleChoices
      },
      {
        type: 'input',
        name: 'moduleAuthorName',
        message: '模块文件创建者姓名',
        store: true
      },
      {
        type: 'input',
        name: 'moduleAuthorEmail',
        message: '模块文件创建者电子邮箱',
        store: true
      },
    ]).then((answers) => {
      Object.assign(this.answers, answers)
    })
  }

  writing() {
    const { pageName, moduleType, moduleName } = this.answers
    const fullPathOfSource = this.templatePath(`${moduleType}-name.js`)
    const fullPathOfDestination = this.destinationPath(`src/pages/${pageName}/${moduleType}s/${moduleName}.js`)
    this.fs.copyTpl(fullPathOfSource, fullPathOfDestination, this.answers, this.tplSettings)
  }

  install() {}

  end() {}
}
