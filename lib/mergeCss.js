const fs=require('fs');
const path = require('path');
const { resolve } = require('dns');
const matchHref = require('./utils').matchHref
const fileName = require('./utils').fileName
const extName = require('./utils').extName
const isHttp = require('../lib/utils').isHttp
const makedir = require('../lib/utils').makedir
const src = require('./utils').src
const returnCssPath = require('./returnCssPath').returnCssPath
const sassTocss = require('./sassTocss').asyncReadSass
const asyncReadFile = require('./readfile').asyncReadFile
const lessTocss = require('./lessToCss').asyncToCss
const urlVersion = require('./utils').urlVersion
const concatdir = require('./utils').concatdir
const readfile = require('./readfile').asyncReadFile
//分析css中 url 复制img
const copyUrlImg = async (href, pwd, output)=>{
    let content = await readfile(href)
    let pattern =/[\"|'](.*?)[\"|']/gi;
    let r=/["|'](.*)["|']/;
    let res = []
    let urlArr = content.match(pattern)
    console.log(urlArr,9999);
    urlArr.forEach(item=>{
        res.push(item.match(r)[1])
    })
    // return res
    concatdir(pwd, output, res)
}
exports.saveData = async (_path, dir, ext)=>{
    let content = ''
    if (ext == 'css') {
        _path = returnCssPath(_path, dir)
        let exten = extName(_path)
        if (exten == 'sass') {
            content =  await sassTocss(_path)
        }
        else if(exten == 'scss'){
            content = await sassTocss(_path)
        }
        else if(exten == 'less'){
            let data = await asyncReadFile(_path)
            content = await lessTocss(data)
        }
        else if(exten == 'null'){
            console.log(`${_path}样式表不存在`);
            return
        }
        else{
            content = await asyncReadFile(_path)
        }
    }
    return {content:content,_path:_path}
}
exports.addVersion = async (_path, dir, ext, version)=>{
    let content = await (await this.saveData(_path, dir, ext)).content
    content = await urlVersion(content, version)
    return content
}
exports.merge = async (page, pwd, version, output)=>{
    await makedir(`${pwd}/${output}/css`)
}