function isRelative(url) {
    var relpath = /^\.{1,2}\/([^\\\/\:\*\?\"\<\>\|]+\/)*[^\<\>\/\\\|\:\"\*\?]+\.[a-z0-9]+$/i;
    return relpath.test(url)
}
const path = require("path")
console.log(isRelative('node_modules/commontpl/footer/css/footer.css'));
exports.urlVersion = async (content,dir)=>{
    let _path = './node_modules/commomtpl'
    var pattern =/[\"|'](.*?)[\"|']/gi;
    var r=/["|'](.*)["|']/;
    // let res = content.replace(pattern,(data)=>{
    //     let out = data.replace(r,(out)=>{
    //         let url = path.join(_path, dir, out.split(/["|']/)[1])
    //         console.log(url);
    //         return url
    //     })
    //     return out
    // })
    let res = content.match(pattern)
    let arr = []
    res.forEach(item => {
        arr.push(item.match(r)[1])
        // console.log(item.match(r)[1]);
    });
    console.log(arr);
    return res
}

console.log(this.urlVersion('background: url("./img/pipa.jpg");background: url("./img/pipa.jpg");background: url("./img/pipa.jpg");',"footer"))

console.log(path.join('module', 'footer','../static/img/1.png'));