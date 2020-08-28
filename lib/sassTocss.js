const sass = require('node-sass')
let readcss = (fileName)=>{
    return new Promise((resolve, reject)=>{
        sass.render({file:fileName,outputStyle: 'expanded'},(err,data)=>{
            if(err) reject(err)
            resolve(data.css)
        })
    })
}
exports.asyncReadSass = async (fileName)=>{
    var f1 = await readcss(fileName);
    return f1.toString()
};
