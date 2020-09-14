const path = require('path')
const fs = require('fs')
const compileTs = require('./compileTs').compileTs
const readAst = require('./readAst').readAst
const webpack = require('./webpack').webpack
const readfile = require('../readfile').asyncReadFile
const wrapper = require('./wrapper').wrapper
exports.compile = (pwd, dir)=>{
    //读取配置文件
    const entry =  require(`${pwd}/webpack.config`)
    //获取入口文件路径
    let entryFile = entry.entry.controller
    let filepath = path.join(pwd, entryFile)
    //入口文件所在目录
    let entryDir = entryFile.split('/').slice(-9999,-1).join("/")

    let fileSet = readAst(filepath, entryFile, entryDir, pwd).fileSet
    let res = readAst(filepath, entryFile, entryDir, pwd).res
    wrapper(fileSet, res)
    // console.log(fileSet);
    // console.log(res);
    // let fileSetArr = [...fileSet]
    // let obj = {}
    // for (let i = 0; i < fileSetArr.length; i++) {
    //     obj[fileSetArr[i]] = `(function(module, exports, __webpack_require__){${res[i]}})`
        
    // }
    // console.log(obj);
    // fs.writeFileSync('./obj.js',JSON.stringify(obj))
    
}