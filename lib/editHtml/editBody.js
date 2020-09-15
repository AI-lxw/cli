const cheerio = require('cheerio')
const { isHttp } = require('../utils');
//分析body img的src script的src
exports.editBody = async (ele,content,version)=>{
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