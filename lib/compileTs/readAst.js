var ts = require("typescript");
const compileTs = require('./compileTs').compileTs
exports.readAst = (file)=>{
    let program = ts.createProgram([file], { allowJs: true });
    // let sourceFile = program.getSourceFile(file);
    // let resolvedModules = sourceFile.resolvedModules
    // console.log(resolvedModules);
    let res = []
    let relativePaths = []
    let rootSource = program.getSourceFile(file)
    function recursive(sourceFile){
        ts.forEachChild(sourceFile,(node)=>{
            if (!ts.isImportDeclaration(node)) return
            let sourcefile = sourceFile
            let name = node.moduleSpecifier.text
            let resolvedModules = sourcefile.resolvedModules
            // console.log(resolvedModules);
            let resolvedFileName = resolvedModules.get(name).resolvedFileName
            let relativePath = (name + resolvedModules.get(name).extension)
            console.log(relativePath);
            console.log(resolvedFileName);
            console.log(compileTs(resolvedFileName));
            sourcefile = program.getSourceFile(resolvedFileName)
            recursive(sourcefile)
        })
    }
    

    recursive(rootSource)
    


    // ts.forEachChild(sourceFile, (node)=>{
    //     if (ts.isImportDeclaration(node)) {
    //         let name = node.moduleSpecifier.text
    //         let resolvedFileName = resolvedModules.get(name).resolvedFileName
    //         relativePaths.push(name + resolvedModules.get(name).extension)
    //         res.push(compileTs(resolvedFileName))
    //     }
    // })
    // return {relativePaths:relativePaths, res:res}
}
this.readAst('/home/lxw/work/project/js/index.ts')



