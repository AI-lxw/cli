
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const { extName, fileName, makedir, isHttp, src ,concatdir} = require('../utils');
const saveData = require('../compileCss/mergeCss').saveData
const {readfile} = require('../readfile')
//提取link中的href 单独处理url引入的img
exports.cssUrl = async (content, pwd, output)=>{
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