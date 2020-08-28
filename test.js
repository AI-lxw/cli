const less = require('less')
const asyncReadFile = require('./lib/readfile').asyncReadFile

let tocss = (data)=>{
    return new Promise((resolve, reject)=>{
        less.render(data,(err,output)=>{
            if(err) reject(err)
            resolve(output.css)
        })
    })
}
let asyncToCss = async (data)=>{
    var f1 = await tocss(data);
    return f1.toString()
};

asyncReadFile('./index.less').then(c=>{
    console.log(c);
    asyncToCss(c).then(x=>{
        console.log(x);
    })
})
