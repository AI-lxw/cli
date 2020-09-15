const {extName} = require('../utils')
const {returnCssPath} = require('./returnCssPath')
const {sassTocss} = require('./sassTocss')
const {lessToCss} = require('./lessToCss')
const {readfile} = require('../readfile')
exports.saveData = async (_path, dir, ext)=>{
    let content = ''
    if (ext == 'css') {
        _path = returnCssPath(_path, dir)
        let exten = extName(_path)
        if (exten == 'sass') {
            content =  await sassTocss(_path)
        }
        else if(exten == 'scss'){
            content = await sassTocss(_path)
        }
        else if(exten == 'less'){
            let data = await readfile(_path)
            content = await lessToCss(data)
        }
        else if(exten == 'null'){
            console.log(`${_path}样式表不存在`);
            return
        }
        else{
            content = await readfile(_path)
        }
    }
    return {content:content,_path:_path}
}