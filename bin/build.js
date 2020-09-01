const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path')
const { extName, fileName } = require('../lib/utils');
const transform = require('../lib/transformjs').transform
const mergeCss = require('../lib/mergeCss').merge
const copy = require('../lib/copyimg').copy
const src = require('../lib/utils').src
const makedir = require('../lib/utils').makedir
const isHttp = require('../lib/utils').isHttp
const concatdir = require('../lib/utils').concatdir
const saveData = require('../lib/mergeCss').saveData
//分析link
const editLink =  async (pwd, output,content,version)=>{
    let $ = cheerio.load(content);
    let unmergeArr = []
    let mergeArr = []
    $('head link').each(function() {
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
        let _path =`${pwd}/${mergeArr[i]}`
        let filename = fileName(mergeArr[i])
        let ext = extName(mergeArr[i])
        let c = await saveData(_path, filename, ext, version)
        mergeData += c
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
        let data = await saveData(_path, dir, ext, version)
        fs.writeFile(`./${output}${fileName(unmergeArr[i])}.css`,data,(err)=>{
            if(!err) console.log("save css ok");
        });
    }
    //合并后的css 插入link中
    $('head').append(`<link href="/css/style.css?v=${version}" type="text/css" rel="stylesheet">`)
    return $.html()
}
//分析body img的src script的src
const editBody = async (ele,content,version)=>{
    let $ = cheerio.load(content);
    $(ele).each(function() {
        let src = $(this).attr().src
        if (isHttp(src) || typeof(src) === 'undefined') {
            return
        }
        $(this).attr('src', `${$(this).attr().src}?v=${version}`)
    });
    return $.html();
}
const editHtml = async (pwd,output,content,version)=>{
    let updateLink = await editLink(pwd, output,content,version)
    let updateImg  = await editBody('body img', updateLink, version)
    let updateScript = await editBody('body script', updateImg, version)
    return updateScript
}
exports.build = async (pwd, version ,output) =>{
    //创建build目录
    await makedir(`${pwd}/${output}`)
    //分析入口index.html
    const content = fs.readFileSync(pwd + '/index.html','utf8')
    const $ = cheerio.load(content);
    //转css
    await mergeCss(pwd, version, output)
    //转js
    let jsSrc = src('body script',content,'src')
    await transform(pwd, output, jsSrc)
    //转img
    let imgSrc = src('body img',content,'src')
    await copy(pwd,output,imgSrc)
    //rewrite HTML
    await editHtml(pwd,output,content, version).then(data=>{
        fs.writeFile(`${pwd}/${output}/index.html`,data,(err)=>{
            if (!err) {
                console.log('rewrite HTML ok');
            }
        });
    }).catch(e=>{
        console.log(e);
    })
    
};