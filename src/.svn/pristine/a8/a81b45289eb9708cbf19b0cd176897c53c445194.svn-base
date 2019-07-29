/**
 * 自动创建文件并获取所有的vue文件目录输出到allvue.js中
 * created by 李冰泉
 * 2017-9-7
 * 打开所在目录的命令行cmd  运行node n.js即可
 */

var fs = require('fs')

// path模块，可以生产相对和绝对路径
var path = require('path')
// 获取当前目录绝对路径，这里resolve()不传入参数
var filePath = path.resolve(__dirname, '../views')
var writefilePath = path.resolve(__dirname)

// 读取文件存储数组
var fileArr = []
var fileDevArr = []
fileArr.push('/* *********注意这里的变量不能重复 *************** */')
fileDevArr.push('/* *********注意这里的变量不能重复 *************** */')
writeFileData(fileArr, fileDevArr)

// 读取文件目录
fs.readdir(filePath, 'utf-8', function(err, files) {
  if (err) {
    console.log(err)
    return
  }
  var results = {}
  files.forEach(function(filename) {
    fs.stat(path.join(filePath, filename), function(err, stats) {
      if (err) throw err
      // 文件
      if (stats.isFile()) {
        if (getdir(filename) === 'vue' && filename.indexOf('-') === -1) {
          var newUrl = 'export const ' + getdirname(filename) + " = () => import('./" + filename + "')"
          var devUrl = 'export const ' + getdirname(filename) + " = require('./" + filename + "').default"
          fileArr.push(newUrl)
          fileDevArr.push(devUrl)
          writeFileData(fileArr, fileDevArr)
        }
      } else if (stats.isDirectory()) {
        // 声明备注
        var name = filename
        readFile(path.join(filePath, filename), name)
      }
    })
  })
})

// 写入到filelisttxt文件
function writeFileData(arrdata, devarrdata) {
  var data = arrdata.join('\n')
  var devdata = devarrdata.join('\n')
  fs.writeFile(writefilePath + '/_import_development.js', data + '\n', function(err) {
    if (err) throw err
    console.log('写入_import_development成功')
  })

  fs.writeFile(writefilePath + '/_import_production.js', devdata + '\n', function(err) {
    if (err) throw err
    console.log('写入_import_production成功')
  })
}

// 获取后缀名
function getdir(url) {
  var arr = url.split('.')
  var len = arr.length
  return arr[len - 1]
}
// 获取名不带后缀
function getdirname(url) {
  var arr = url.split('/')
  var len = arr.length
  var name = arr[len - 1].split('.')[0]
  if (name.indexOf('_') > -1) {
    name = name.replace('_', '')
  }
  return name
}

// 获取文件数组
function readFile(readurl, name) {
  fs.readdir(readurl, function(err, files) {
    if (err) {
      console.log(err)
      return
    }

    files.forEach(function(filename) {
      fs.stat(path.join(readurl, filename), function(err, stats) {
        if (err) throw err
        // 是文件
        if (stats.isFile()) {
          // var newUrl = remotePath + name + '/' + filename
          if (getdir(filename) === 'vue' && filename.indexOf('-') === -1) {
            var newUrl = 'export const ' + getdirname(filename) + " = () => import('./" + name + '/' + filename + "')"
            var devUrl = 'export const ' + getdirname(filename) + " = require('./" + name + '/' + filename + "').default"
            fileArr.push(newUrl)
            fileDevArr.push(devUrl)
            writeFileData(fileArr, fileDevArr)
          }
          // 是子目录
        } else if (stats.isDirectory()) {
          var dirName = filename
          readFile(path.join(readurl, filename), name + '/' + dirName)
        }
      })
    })
  })
}
