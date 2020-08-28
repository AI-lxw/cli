const cheerio = require('cheerio');
const rf = require('./lib/readfile').asyncReadFile
const isHttp = require('./lib/utils').isHttp
let test = async ()=>{
    c =  await rf('./index.html')
    const $ = cheerio.load(c);

    $('body script').each(function() {
        let src = $(this).attr().src
        if (isHttp(src) || typeof(src)) {
            return
        }
        $(this).attr('src', `${$(this).attr().src}?v=1.0.0`)
    });
    console.log($.html());
}
test()
