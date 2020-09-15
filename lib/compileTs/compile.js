const path = require('path')
const fs = require('fs')
const compileTs = require('./compileTs').compileTs
const readAst = require('./readAst').readAst
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
    let c = readAst(filepath, entryFile, entryDir, pwd)
    let tpl = fs.readFileSync(path.join(__dirname, './webpack') + '.js')
    let res = tpl + c
    fs.writeFileSync('./data.js', res)

    
    
}