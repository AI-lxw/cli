const sass = require('node-sass')
let readcss = (fileName)=>{
    return new Promise((resolve, reject)=>{
        sass.render({file:fileName},(err,data)=>{
            if(err) reject(err)
            resolve(data.css)
        })
    })
}
var asyncReadCss = async (fileName)=>{
    var f1 = await readcss(fileName);
    return f1.toString()
};
asyncReadCss('./index.sass').then(c=>{
    console.log(c);
})