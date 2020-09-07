const Handlebars = require("handlebars");
const fs = require('fs');
const path = require('path')
const readfile = require('./readfile').asyncReadFile
const isRelative = require('./utils').isRelative
const isExist = require('./utils').isExist
const cheerio = require('cheerio')
const editpath = require('./editpath').editpath

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
