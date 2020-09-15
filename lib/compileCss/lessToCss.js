const less = require('less')
let tocss = (data)=>{
    return new Promise((resolve, reject)=>{
        less.render(data,(err,output)=>{
            if(err) reject(err)
            resolve(output.css)
        })
    })
}
exports.lessToCss = async (data)=>{
    var res = await tocss(data);
    return res.toString()
};
