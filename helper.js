const Handlebars = require("handlebars");
const fs = require('fs');
const { options } = require("less");
const readfile = require('./lib/readfile').asyncReadFile
// Handlebars.registerHelper("import",async function(path) {
//     console.log(path);
//     let html = await readfile(path)
//     // let html = fs.readFileSync(path).toString();
//     console.log(html,111111);
//     return html
// });
Handlebars.registerHelper('lookupOrDefault', function (object, propertyName, defaultValue, options) {
    var result = options.lookupProperty(object, propertyName)
    if (result != null) {
        return result
    }
    return defaultValue
})
const template = Handlebars.compile("{{lookupOrDefault './footer.hbs'}}",{noEscape:true});
console.log(template());