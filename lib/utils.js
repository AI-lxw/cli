const fs = require('fs')
const cheerio = require('cheerio');
const path = require('path')
//文件是否存在
exports.isExist = (_path)=>{
    return fs.existsSync(_path) 
}
//读文件
exports.preadfile = async function(pathname, encoding=''){
    return await new Promise((resolve,reject)=>{
        fs.readFile(pathname,encoding,function(err,data){
            if(!err){
                resolve(data)
            }else{
                reject(err)
            }
        })
    })
}
//提取link href路径
exports.matchHref = (page_path)=>{
    
    var content=fs.readFileSync(page_path);
    var reg=/<link(?:.*?)href=[\"\'](.+?)[\"\'](?!<)(?:.*)\>(?:[\n\r\s]*?)(?:<\/link>)*/gm;
    var linkArr=[];
    while(link=reg.exec(content)){
        var obj={match:link[0],href:link[1]};
        linkArr.push(obj);
    };
    return linkArr
}
//文件名 
exports.fileName = (path)=>{
    return path.split('.').slice(-9999,-1).join(".")
}
//后缀名
exports.extName = (path)=>{
    return path.split('.').slice(-1)[0]
}
//提取src路径
exports.src = (element, conten,attr)=>{
    let $ = cheerio.load(conten);
    let srcArr = []
    $(element).each(function(){
        let src = $(this).attr(attr)
        srcArr.push(src)
    })
    return srcArr
}

//创建目录
exports.makedir = (path)=>{
    fs.mkdirSync(path, {recursive: true });
}

//创建多级目录
exports.concatdir = (pwd, output, array)=>{
    array.forEach(item=>{
        if (typeof(item) === 'undefined' || this.isHttp(item)) {
            return
        }
        let arr = item.split('/')
        let dirarr = arr.slice(1,arr.length - 1);
        let str = `${pwd}/${output}`
        const reducer = (acc, cur) => acc + '/' + cur ;
        console.log(dirarr.reduce(reducer));
        console.log(dirarr.reduce(reducer, str));
        fs.mkdirSync(dirarr.reduce(reducer, str),{recursive:true});
    })
}
exports.rmdir = async (filePath)=>{
    if(!this.isExist(filePath)) return
    const fs = require('fs').promises 
    let stat = await fs.stat(filePath)
    if (stat.isFile()) {
        await fs.unlink(filePath)
    } else {
        let dirs = await fs.readdir(filePath)
        dirs = dirs.map(dir => this.rmdir(path.join(filePath, dir)))
        await Promise.all(dirs)
        await fs.rmdir(filePath)
    }
}
exports.pathFomat = (_path)=>{
   return  _path.split('?')[0]
}
exports.isHttp = (src)=>{
    var patt = /(http|https):\/\/([\w.]+\/?)\S*/　
    return patt.test(src)
}
exports.urlVersion = async (content,version)=>{
    var pattern =/[\"|'](.*?)[\"|']/gi;
    var r=/["|'](.*)["|']/;
    let res = content.replace(pattern,(data)=>{
        let out = data.replace(r,(out)=>{
            return `'${out.split(/["|']/)[1]}?v=${version}'`
        })
        return out
    })
    return res
}
exports.saveData = async (_path,version)=>{
    let content = ''
    let dir = fileName(_path)
    let ext = extName(_path)
    if (ext == 'css') {
        _path = returnCssPath(_path, dir)
        let exten = extName(_path)
        if (exten == 'sass') {
            content =  await sassTocss(_path)
        }
        if(exten == 'scss'){
            content = await sassTocss(_path)
        }
        if(exten == 'less'){
            let data = await asyncReadFile(_path)
            content = await lessTocss(data)
        }
        if(exten == 'null'){
            console.log(`${_path}样式表不存在`);
        }
        content = await asyncReadFile(_path)
    }
    content = await urlVersion(content,version)
    return content
}