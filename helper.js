const Handlebars = require("handlebars");
const fs = require('fs');
const { options } = require("less");
const readfile = require('./lib/readfile').asyncReadFile
Handlebars.registerHelper("import",function(path) {
    console.log(path);
    // let html = await readfile(path)
    let html = fs.readFileSync(path).toString();
    console.log(html,111111);
    return html;
});
const template = Handlebars.compile("{{import './footer.hbs'}}",{noEscape:true});
console.log(template());