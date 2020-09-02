const Handlebars = require("handlebars");
const fs = require('fs');
const readfile = require('./readfile').asyncReadFile
const isRelative = require('./utils').isRelative
const isExist = require('./utils').isExist


exports.hbsHelper = async (path,pwd)=>{
    Handlebars.registerHelper("import",function(path) {
        console.log(path);
        console.log(isRelative(path));
        if (!isRelative(path)) {
            path = `${pwd}/node_modules/commontpl/${path}/${path}.html`
        }
        console.log(path);
        if (isExist(path)) {
            let html = fs.readFileSync(path,'utf8').toString();
            console.log(html);
            return html;
        }else{
            console.log('模板不存在');
            return ''
        }
        
        
    });
    let data = await readfile(path)
    const template = Handlebars.compile(data,{noEscape:true});
    return template()
}
