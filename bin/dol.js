#!/usr/bin/env node

/**
 * @file where your common css is imported. <$= appCreateDate $>
 * @author mengqingshen, mengqingshen_sean@outlook.com
 */


const fs = require('fs')
const path = require('path')
const yeoman = require('yeoman-environment')

const env = yeoman.createEnv()
const DEFAULT_COMMAND = 'init'

const validCommands = new Map([
  [DEFAULT_COMMAND, 'app']
])

const generatorsRoot = path.resolve(__dirname, '../generators')

const subDirs = fs.readdirSync(generatorsRoot)
if (!subDirs || !subDirs[0]) {
  return
}
subDirs.forEach((name) => {
  validCommands.set(name, name)
  env.register(require.resolve('generator-dolphin'), 'dolphin:app')
})

const command = process.argv[2] || DEFAULT_COMMAND

if (validCommands.has(command)) {
  env.run(`dolphin:${validCommands.get(command)} ${process.argv.slice(3)}`, () => {})
} else {
  console.error('无效的指令！')
  console.log(`
dol ${[...validCommands.keys()].join('|')}
  `)
}
