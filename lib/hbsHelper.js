const Handlebars = require("handlebars");
const fs = require('fs');
const readfile = require('./readfile').asyncReadFile
Handlebars.registerHelper("import",function(path) {
    console.log(path);
    // let html = await readfile(path)
    let html = fs.readFileSync(path).toString();
    console.log(html,111111);
    return html;
});
exports.hbsHelper = async (path)=>{
    let data = await readfile(path)
    const template = Handlebars.compile(data,{noEscape:true});
    console.log(template());
    return template()
}
this.hbsHelper('../index.html')