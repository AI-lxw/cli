const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path')
const { extName, fileName, makedir, isHttp, src ,concatdir} = require('../lib/utils');
const {transform} = require('../lib/compileJs/transformjs')
const {copyImg} = require('../lib/copyimg')
const {saveData} = require('../lib/compileCss/mergeCss')
const {addVersion} = require('../lib/compileCss/mergeCss')
const {hbsHelper} = require('../lib/compileJs/hbsHelper')
const {readfile} = require('../lib/readfile')
const mergeCss = require('../lib/compileCss/mergeCss').merge

//分析link
const editLink =  async (pwd, output, content, version)=>{
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
//提取link中的href 单独处理url引入的img
const cssUrl = async (content, pwd, output)=>{
    let $ = cheerio.load(content);
    $('link').each(async function(){
        if(isHttp($(this).attr().href)) return
        let href = $(this).attr().href
        href = (await saveData(`${pwd}${href}`, fileName(`${pwd}${href}`),extName(href)))._path
        let css = await readfile(href)
        let pattern =/[\"|'](.*?)[\"|']/gi;
        let r=/["|'](.*)["|']/;
        let url = css.match(pattern)
        if(url === null) return
        let hrefDir = href.split('/').slice(-9999,-1).join('/')
        url.forEach(item=>{
            let imgRelativePath = item.match(r)[1]
            let imgAbsolutePath = path.join(hrefDir, imgRelativePath)
            let pwdImgPath = `${pwd}/${output}${imgAbsolutePath.split(pwd)[1]}`;
            makedir(pwdImgPath.split('/').slice(-9999,-1).join('/'))
            fs.copyFile(imgAbsolutePath,pwdImgPath,e=>{
                if (!e) console.log('复制url中img ok');
            })
        })
        
    })
}
exports.build = async (pwd, version ,output) =>{
    //创建build目录
    await makedir(`${pwd}/${output}`)
    //分析入口index.html
    // const content = fs.readFileSync(pwd + '/index.html','utf8')
    let content = await hbsHelper(pwd + '/index.html',pwd)
    const $ = cheerio.load(content);
    //复制img (css background中url)
    await cssUrl(content, pwd, output)
    //合并css
    await mergeCss(content,pwd, version, output)
    //编译js
    let jsSrc = src('body script',content,'src')
    await transform(pwd, output, jsSrc)
    //复制img(html img的src)
    let imgSrc = src('img',content,'src')
    await copyImg(pwd, output, imgSrc)
    
    //rewrite HTML
    await editHtml(pwd, output, content, version).then(data=>{
        fs.writeFile(`${pwd}/${output}/index.html`,data,(err)=>{
            if (!err) {
                console.log('rewrite HTML ok');
            }
        });
    }).catch(e=>{
        console.log(e);
    })

};