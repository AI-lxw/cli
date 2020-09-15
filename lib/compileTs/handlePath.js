//__webpack_require__("./components/utils" ===>"./js/components/utils"); 路径二次处理
const path = require('path')
exports.handlePath = (content)=>{
    let partten =/(?<=require\()(\s*[\"\'](.+?)[\"\']\s*)/g
            
    content = content.replace(partten,(data)=>{
        data = path.join('js',data.split(/["|']/)[1])
        data = `'./${data}.ts'`
        return data
    })
    console.log(content,123456);
    return content
}