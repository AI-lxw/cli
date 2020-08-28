const fs=require('fs');
const path = require('path');
const matchHref = require('./utils').matchHref
const fileName = require('./utils').fileName
const extName = require('./utils').extName
const isHttp = require('../lib/utils').isHttp
const src = require('./utils').src
const returnCssPath = require('./returnCssPath').returnCssPath
const sassTocss = require('./sassTocss').asyncReadSass
const asyncReadFile = require('./readfile').asyncReadFile
const lessTocss = require('./lessToCss').asyncToCss
const urlVersion = require('./utils').urlVersion
exports.saveData = async (_path, dir, ext ,version)=>{
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
        }
        else{
            content = await asyncReadFile(_path)
        }
    }
    content = await urlVersion(content,version)
    console.log(content);
    return content
}
exports.merge = async (pwd, version, output)=>{
    //提取link标签中css文件路径
    page_path = pwd + '/index.html'
    let page = await asyncReadFile(page_path)
    let hrefArr = src('link',page,'href')
    // makedir(`${pwd}/${output}/css`)  
    //读取数据中的文件 并合并
    let content = '';
    let _path = ''
    hrefArr.forEach(item=>{
        if (isHttp(item)) {
            return
        }
        _path = item
        _path = path.join(pwd,_path)
        let ext = extName(_path)
        let dir = fileName(_path)
        this.saveData(_path, dir, ext, version).then(data=>{
            content += data
            //合并 输出
            fs.writeFileSync(`./${output}/css/style.css`,content);
        }).catch(e=>{
            console.log(e);
        })
    })
   
}