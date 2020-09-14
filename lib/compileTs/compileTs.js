const ts = require('typescript')
const fs = require('fs')
const readfile = require('../readfile').asyncReadFile
exports.compileTs = (_path)=>{
    let source = fs.readFileSync(_path).toString()
    let result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS }}).outputText;
    console.log(result);
    return result
}
// this.compileTs('../../js/index.ts')