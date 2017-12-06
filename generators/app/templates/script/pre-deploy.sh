#!/bin/bash

#检测系统信息
echo "PWD:" `pwd`
echo "system version: " `cat /proc/version`
echo "who am i: " `whoami`

#把nvm加入路径
source /home/sankuai/.bashrc

#切换node版本
nvm install v8.9.1
nvm ls
nvm use v8.9.1

#检测node版本
echo "node version: " `node -v`
echo "npm version: " `npm -v`

#安装cnpm
# npm install  cnpm --registry=http://r.npm.sankuai.com

#借助cnpm快速安装node-sass
# ./node_modules/cnpm/bin/cnpm install node-sass

export SASS_BINARY_SITE=http://npm.taobao.org/mirrors/node-sass/

#安装依赖
npm install --registry=http://r.npm.sankuai.com

#打包基础库文件
#gulp

#进行打包
npm run build

#把文件上传到云上
node ./script/upload.js
