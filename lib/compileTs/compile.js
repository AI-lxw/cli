const path = require('path')
const compileTs = require('./compileTs').compileTs
const readAst = require('./readAst').readAst
const webpack = require('./webpack').webpack
const readfile = require('../readfile').asyncReadFile
exports.compile = (pwd, dir)=>{
    
    const entry =  require(`${pwd}/webpack.config`)
    let entryFile = entry.entry.controller
    let filepath = path.join(pwd, entryFile)
    console.log(readAst(filepath).relativePaths);

    
}