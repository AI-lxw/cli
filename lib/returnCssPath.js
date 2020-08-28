const isExist = require('./utils').isExist
exports.returnCssPath = (_path, dir)=>{
    if(!isExist(_path)){
        _path = `${dir}.sass`
    }
    if(!isExist(_path)){
        _path = `${dir}.scss`
    }
    if(!isExist(_path)){
        _path = `${dir}.less`
    }
    if(!isExist(_path)){
        _path = '.null'
    }
    return _path
}