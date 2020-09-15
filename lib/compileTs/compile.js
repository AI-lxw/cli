const path = require('path')
const fs = require('fs')
const readAst = require('./readAst').readAst
exports.compile = (pwd, dir)=>{
    //读取配置文件
    const entry =  require(`${pwd}/config`)
    const {outDir} = require(`${pwd}/tsconfig.json`).compilerOptions
    console.log(outDir,11111);
    //获取入口文件路径
    let entryFile = entry.entry.controller
    let filepath = path.join(pwd, entryFile)
    //入口文件所在目录
    let entryDir = entryFile.split('/').slice(-9999,-1).join("/")
    let c = readAst(filepath, entryFile, entryDir, pwd)
    let tpl = fs.readFileSync(path.join(__dirname, './webpack') + '.js').toString()
    tpl = tpl.replace('./js/index.ts',entryFile)
    let res = tpl + c
    fs.mkdirSync(outDir)
    fs.writeFileSync(`${outDir}/data.js`, res)
    
}