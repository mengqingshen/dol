#!/usr/bin/env node

/**
 * @file where your common css is imported. <$= appCreateDate $>
 * @author <$= appAuthorName $>, <$= appAuthorEmail $>
 */

const yeoman = require('yeoman-environment')

console.log('argv', process.argv)
const env = yeoman.createEnv()
env.register(require.resolve('generator-dolphin'), 'dolphin:app')

env.run('dolphin:app', () => {})
