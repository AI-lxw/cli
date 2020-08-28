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
const hbs = require('hbs')
const isExist = require('../lib/utils').isExist
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
    hbs.registerPartials(pwd + '/views')

    const server = http.createServer(function (req, res) {
        let _path = req.url
        if(_path == '/'){
            _path = 'index.html'
            // _path = path.join(pwd,_path)
            // console.log(_path);
            // if(!isExist(_path)){
            //     _path = 'index.hbs'
            // }
        }
        _path = path.join(pwd,_path)
        _path = pathFomat(_path)
        let ext = extName(_path)
        let dir = fileName(_path)
        sendData(_path, res, dir, ext).then(_path=>{
            console.log(_path,1111111);
            
            let Header = mime.getType(_path);
            if (mime.getType(_path) == 'text/x-handlebars-template') {
                Header = 'text/html'
            }
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