const cheerio = require('cheerio')
exports.secondProcess = async (page, pwd)=>{
    let $ = cheerio.load(page);
    const edit = (ele)=>{
        $(ele).each(function(){
            if ($(this).attr().origin == 'npm') {
                $(this).attr().src = ($(this).attr().src).split('/node_modules/commontpl')[1]
            }
        })
    }
    //edit link
    $('link').each(function() {
        if ($(this).attr().origin == 'npm') {
            $(this).attr().href = ($(this).attr().href).split('/node_modules/commontpl')[1]
        }
    });
     
    edit('img')
    edit('script')
    return $.html()
}
