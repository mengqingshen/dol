#!/usr/bin/env node

/**
 * @file where your common css is imported. <$= appCreateDate $>
 * @author <$= appAuthorName $>, <$= appAuthorEmail $>
 */

const yeoman = require('yeoman-environment')

const env = yeoman.createEnv()
env.register(require.resolve('generator-dolphin'), 'dolphin:app')

const validCommands = new Map([
  ['init', 'app'],
  ['app', 'app'],
  ['page', 'page'],
  ['module', 'module'],
  ['clean', 'clean']
])

const DEFAULT_COMMAND = 'init'

const command = process.argv[2] || DEFAULT_COMMAND

if (validCommands.has(command)) {
  env.run(`dolphin:${validCommands.get(command)} ${process.argv.slice(3)}`, () => {})
} else {
  console.error('无效的指令！')
  console.log(`
    dol ${validCommands.keys().join('|')}
  `)
}
