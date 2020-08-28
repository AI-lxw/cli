const cheerio = require('cheerio');
const fs = require('fs');
const { extName, fileName } = require('../lib/utils');
const transform = require('../lib/transformjs').transform
const mergeCss = require('../lib/mergeCss').merge
const copy = require('../lib/copyimg').copy
const src = require('../lib/utils').src
const makedir = require('../lib/utils').makedir
const isHttp = require('../lib/utils').isHttp
const concatdir = require('../lib/utils').concatdir
const saveData = require('../lib/mergeCss').saveData
const editLink =  async (pwd, output,content,version)=>{
    let $ = cheerio.load(content);
    let unmergeArr = []
    $('head link').each(function() {
        if (isHttp($(this).attr().href)) return
        if ($(this).attr().merge == '') $(this).attr().merge = 'true'
        if ($(this).attr().merge == 'true') $(this).remove()
        if(typeof($(this).attr().merge) === 'undefined' || $(this).attr().merge == 'false'){
            unmergeArr.push($(this).attr().href)
        }
        concatdir(pwd, output, unmergeArr)
        unmergeArr.forEach(item=>{
            console.log(item);
            let _path =`${pwd}/${item}`
            let filename = fileName(item)
            let ext = extName(item)
            saveData(_path,filename,ext,version).then(res=>{
                console.log(res,111111);
                fs.writeFileSync(`${pwd}/${output}${filename}.css`,res);
            })
            
            // fs.copyFile(`${pwd}/${item}`, `${pwd}/${output}${item}`, (e)=>{
            //     if(e){console.log(e)}
            // });
        })
        
    });
    $('head').append(`<link href="/css/style.css?v=${version}" type="text/css" rel="stylesheet">`)
    return $.html()
}
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
    makedir(`${pwd}/${output}`)
    //分析入口index.html
    const content = fs.readFileSync(pwd + '/index.html','utf8')
    const $ = cheerio.load(content);
    //转css
    mergeCss(pwd, version, output)
    //转js
    let jsSrc = src('body script',content,'src')
    transform(pwd, output, jsSrc)
    //转img
    let imgSrc = src('body img',content,'src')
    copy(pwd,output,imgSrc)
    //rewrite HTML
    // $('link').remove()
    // $('head').append(`<link href="/css/style.css?v=${version}" type="text/css" rel="stylesheet">`)
    editHtml(pwd,output,content, version).then(data=>{
        fs.writeFileSync(`${pwd}/${output}/index.html`,data);
    }).catch(e=>{
        console.log(e);
    })
    
};