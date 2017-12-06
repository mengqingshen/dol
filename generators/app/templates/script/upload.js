const fs = require('fs')
const MSS = require('mss-sdk')

const data = JSON.parse(fs.readFileSync('.yo-rc.json', 'utf-8'))['generator-rick']
const bucketName = data.cdn.bucketName
const publicPath = 'public/'
const s3 = new MSS.S3({
  accessKeyId: data.cdn.accessKeyId,
  secretAccessKey: data.cdn.secretAccessKey,
  endpoint: 'mss.vip.sankuai.com'
})

// 上传文件
const readAndPostFile = function (fileName, type) {
  let contentType = 'text/javascript'
  switch (type) {
    case 'js':
      contentType = 'text/javascript'
      break
    case 'css':
      contentType = 'text/css'
      break
    default:
      contentType = 'text/javascript'
  }
  const file = fs.createReadStream(fileName)
  const key = fileName.split(publicPath)[1]

  console.log('上传文件', key, file)

  const params = {
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
    Body: file
  }

  console.log('parameters:', JSON.stringify(params))

  s3.putObject(params)
    .on('httpHeaders', (statusCode, headers) => {
      console.log('headers:', headers)
    })
    .on('httpUploadProgress', (progress) => {
      console.log(progress)
    })
    .on('error', (err) => {
      console.log(err.red)
    })
    .on('success', () => {
      console.log('success')
    })
    .send()

  s3.listObjects(params, (err, _data) => {
    if (err) {
      console.log(`获取资源信息报错啦 ~ \n${err}`)
      return false
    }
    console.log('获取资源成功', JSON.stringify(_data))
  })
}

// 读取build文件夹下所有js,css文件
const readDirFiles = function (pathName, type) {
  fs.readdir(pathName, (err, files) => {
    if (err) {
      console.log(err)
      return
    }
    files.forEach((fileName) => {
      const wholePathName = `${pathName}/${fileName}`
      fs.stat(wholePathName, (error, stats) => {
        if (error) {
          console.log(error)
          return false
        }
        if (stats.isFile()) {
          readAndPostFile(wholePathName, type)
        } else if (stats.isDirectory()) {
          readDirFiles(wholePathName, type)
        }
      })
    })
  })
}

// 读取静态资源JS & DLL & Styles
const loopStaticPath = function () {
  const packageArray = ['js', 'css']
  packageArray.forEach((item) => {
    readDirFiles(publicPath + item, item)
  })
}

!(function () {
  const params = { Bucket: bucketName }
  s3.headBucket(params, (err) => {
    if (err) {
      console.log(`寻找bucket报错啦:${err}`, err.stack)
      params.ACL = 'public-read'
      s3.createBucket(params, (error) => {
        if (error) {
          console.log(err, err.stack)
        } else {
          console.log('建好bucket啦')
          loopStaticPath()
        }
      })
    } else {
      console.log(`成功找到bucket啦:${data}`)
      loopStaticPath()
    }
  })
}())
