const cheerio = require('cheerio')
const path = require('path')
const fs = require('fs')
const { extName, fileName, makedir, isHttp ,concatdir} = require('../utils');
const saveData = require('../compileCss/mergeCss').saveData
const {addVersion} = require('./addVersion')
//分析link
exports.editLink =  async (pwd, output, content, version)=>{
    let $ = cheerio.load(content);
    let unmergeArr = []
    let mergeArr = []
    $('link').each(function() {
        if (isHttp($(this).attr().href)) return
        if ($(this).attr().merge == '') $(this).attr().merge = 'true'
        if ($(this).attr().merge == 'true') {
            mergeArr.push($(this).attr().href)
            $(this).remove()
        }
        if(typeof($(this).attr().merge) === 'undefined' || $(this).attr().merge == 'false'){
            unmergeArr.push($(this).attr().href)
        }
        
    });
    //有合并属性的css
    await makedir(`${pwd}/${output}/css`)
    let mergeData = ''
    for (let i = 0; i < mergeArr.length; i++) {
        let _path =path.join(pwd,mergeArr[i])
        let ext = extName(_path)
        let dir = fileName(_path)
        let conten = (await saveData(_path, dir, ext)).content
        conten = await addVersion(_path, dir, ext, version)
        mergeData += conten
    }
    fs.writeFile(`./${output}/css/style.css`,mergeData,(err)=>{
        if(!err) console.log("merge css ok");
    });

    //创建没有合并属性的css目录
    concatdir(pwd, output, unmergeArr)
    for (let i = 0; i < unmergeArr.length; i++) {
        let _path = path.join(pwd,unmergeArr[i])
        let ext = extName(_path)
        let dir = fileName(_path)
        let data = (await saveData(_path, dir, ext)).content
        data = await addVersion(_path, dir, ext, version)
        fs.writeFile(`./${output}${fileName(unmergeArr[i])}.css`,data,(err)=>{
            if(!err) console.log("save css ok");
        });
    }
    //合并后的css 插入link中
    $('head').append(`<link href="/css/style.css?v=${version}" type="text/css" rel="stylesheet">`)
    return $.html()
}