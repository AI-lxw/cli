const ts = require('typescript')
const fs = require('fs')
const {handlePath} = require('./handlePath')
exports.compileTs = (_path)=>{
    let source = fs.readFileSync(_path).toString()
    let result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS }}).outputText;
    console.log(result);
    result= handlePath(result)
    var partten =/(?<=\=|\s+)require(?=\()/g
    result = result.replace(partten,'__webpack_require__')
    return result
}
// this.compileTs('../../js/index.ts')