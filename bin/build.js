const cheerio = require('cheerio');
const fs = require('fs');
const { makedir, src} = require('../lib/utils');
const {transform} = require('../lib/compileJs/transformjs')
const {copyImg} = require('../lib/copyimg')
const {hbsHelper} = require('../lib/compileJs/hbsHelper')
const mergeCss = require('../lib/compileCss/mergeCss').merge
const {editHtml} = require('../lib/editHtml/index')
const {cssUrl} = require('../lib/editHtml/cssUrl')
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