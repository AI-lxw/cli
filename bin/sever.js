const http = require('http');
const path = require('path')
const mime = require('mime');
const {extName, fileName, preadfile, pathFomat} = require('../lib/utils')
const {readfile} = require('../lib/readfile')
const {hbsHelper} = require('../lib/compileJs/hbsHelper')
const {returnCssPath} = require('../lib/compileCss/returnCssPath')
const {sassTocss} = require('../lib/compileCss/sassTocss')
const lessTocss = require('../lib/compileCss/lessToCss').lessToCss
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
            let data = await readfile(_path)
            res.end(await lessTocss(data))
        }
        if(exten == 'null'){
            console.log(`${_path}样式表不存在`);
        }
    }
    return _path
}

exports.start = (port = 7012, pwd) =>{
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
