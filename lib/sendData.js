
// const {returnCssPath} = require('./compileCss/returnCssPath')
// const {sassTocss} = require('./compileCss/sassTocss')
// const lessTocss = require('./compileCss/lessToCss').lessToCss
// const {readfile} = require('./readfile')
exports.sendData = async (_path, res, dir, ext)=>{
    if (ext == 'css') {
        _path = returnCssPath(_path, dir)
        let exten = extName(_path)
        if (exten == 'sass') {
            res.end(await sassTocss(_path))
        }
        if(exten == 'scss'){
            res.end(await sassTocss(_path))
        }
        if(exten == 'less'){
            let data = await readfile(_path)
            res.end(await lessTocss(data))
        }
        if(exten == 'null'){
            console.log(`${_path}样式表不存在`);
        }
    }
    return _path
}
