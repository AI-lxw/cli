const Handlebars = require("handlebars");
const fs = require('fs');
const {readfile} = require('../readfile')
const {editpath} = require('../editpath')
const {isRelative} = require('../utils')

exports.hbsHelper = async (_path, pwd)=>{
    Handlebars.registerHelper("import",function(path) {
        if (isRelative(path)) {
            return fs.readFileSync(path).toString()
        }else{
            return editpath(pwd, path)
        }
    });
    let data = await readfile(_path)
    const template = Handlebars.compile(data, {noEscape:true});
    return template()
}
