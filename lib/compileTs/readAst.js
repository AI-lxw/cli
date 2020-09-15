const ts = require("typescript");
const path = require('path');
const fs = require('fs')
const compileTs = require('./compileTs').compileTs
const handlePath = require('./handlePath').handlePath
exports.readAst = (file, entryFile, entryDir, pwd)=>{
    let program = ts.createProgram([file], { allowJs: true });
    let rootSource = program.getSourceFile(file)
    //new 一个Set对象 防止重复编译
    let fileSet = new Set()
    fileSet.add(entryFile)
    let res = []
    let obj = {}
    let entryRes = compileTs(path.join(pwd, entryFile))
    res.push(entryRes)
    function recursive(sourceFile){
        ts.forEachChild(sourceFile,(node)=>{
            if (!ts.isImportDeclaration(node)) return
            let sourcefile = sourceFile
            let name = node.moduleSpecifier.text
            let resolvedModules = sourcefile.resolvedModules
            // console.log(resolvedModules);
            //绝对路径
            let resolvedFileName = resolvedModules.get(name).resolvedFileName
            //相对路径
            let relativePath = (name + resolvedModules.get(name).extension)
            // path.join(入口文件所在目录,相对路径)
            let key = './' + path.join(entryDir, relativePath)
            //fileSet 中不可有重复元素
            if (fileSet.has(key))  return
            fileSet.add(key)
            let conpileRes = compileTs(resolvedFileName)
            //返回键值对
            obj[key] = conpileRes
            res.push(conpileRes);
            sourcefile = program.getSourceFile(resolvedFileName)
            recursive(sourcefile)
        })
    }
    

    recursive(rootSource)
    // console.log(res);
    // console.log(fileSet);
    let fileSetArr = [...fileSet]
    let c = ''
    res.forEach((item,i)=>{
        c += `\n'${fileSetArr[i]}':\n(function(module, exports, __webpack_require__) {${item}}),\n`
        
    })
    c = '({' + c + '})'
    
    return c
}
// this.readAst('/home/lxw/work/project/js/index.ts','./js/index.ts','js')



