const fs = require('fs');
const path = require('path')
const cheerio = require('cheerio')
//分析css
const anlLink = (content, ele, dir)=>{
    let $ = cheerio.load(content);
    let res = ''
    let _path = ''
    $(ele).each(function() {
        if ($(this).attr().origin == 'npm') {
            _path = '/' + path.join('./node_modules/commontpl',dir,$(this).attr().href)
            console.log(_path);
            $(this).attr().href = _path
            res = $.html()
        }
    });
    return {res:res,_path:_path}
}
//分析Script img
const anlHtml = (content,ele ,dir)=>{
    let $ = cheerio.load(content);
    let res = ''
    $(ele).each(function() {
        if ($(this).attr().origin == 'npm') {
            let _path = '/' + path.join('./node_modules/commontpl',dir,$(this).attr().src)
            console.log(_path);
            $(this).attr().src = _path
            res = $.html()
        }
    });
    return res
}
exports.editpath = (pwd, path)=>{
    let hbspath = `${pwd}/node_modules/commontpl/${path}/${path}.html`
    let html = fs.readFileSync(hbspath).toString()
    let resLink = anlLink(html, 'link', path).res
    // let csspath = anlLink(html, 'link', path)._path
    let resScript = anlHtml(resLink, 'script', path)
    // console.log(resScript);
    return resScript
}