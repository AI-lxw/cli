const http = require('http');
const path = require('path')
const mime = require('mime');
const preadfile = require('../lib/utils').preadfile
const fileName = require('../lib/utils').fileName
const extName = require('../lib/utils').extName
const pathFomat = require('../lib/utils').pathFomat
const returnCssPath = require('../lib/returnCssPath').returnCssPath
const sassTocss = require('../lib/sassTocss').asyncReadSass
const lessTocss = require('../lib/lessToCss').asyncToCss
const asyncReadFile = require('../lib/readfile').asyncReadFile
const hbsHelper = require('../lib/hbsHelper').hbsHelper
const isExist = require('../lib/utils').isExist
const cssmodule = require('../lib/cssmodule').anlCss
const cheerio = require('cheerio')
const hostname = '127.0.0.1';

let sendData = async (_path, res, dir, ext)=>{
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
            let data = await asyncReadFile(_path)
            res.end(await lessTocss(data))
        }
        if(exten == 'null'){
            console.log(`${_path}样式表不存在`);
        }
    }
    return _path
}

exports.start = (port = 7011, pwd) =>{
    const server = http.createServer(async function (req, res) {
        let _path = req.url
        if(_path == '/'){
            _path = 'index.html'
            let content = await hbsHelper(`${pwd}/${_path}`,pwd)
            res.end(content)
            return
        }
        _path = path.join(pwd,_path)
        _path = pathFomat(_path)
        let ext = extName(_path)
        let dir = fileName(_path)
        sendData(_path, res, dir, ext).then(_path=>{
            console.log(_path);
            let Header = mime.getType(_path);
            res.setHeader('Content-Type', Header);
            preadfile(_path).then((data)=>{
                res.end(data);
                res.statusCode = 200;
            }).catch(e=>{
                console.log(`找不到文件`);
                res.statusCode = 404;
                res.end('');
            }) 
        }).catch(e=>{})
    })
    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
    
    
};
