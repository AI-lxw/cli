const less = require('less')
let tocss = (data)=>{
    return new Promise((resolve, reject)=>{
        less.render(data,(err,output)=>{
            if(err) reject(err)
            resolve(output.css)
        })
    })
}
exports.asyncToCss = async (data)=>{
    var f1 = await tocss(data);
    return f1.toString()
};
