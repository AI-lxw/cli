var foo = function(){
    "use strict";

    exports.__esModule = true;
    exports.findDom = void 0;
    function findDom(id) {
        console.log(document.querySelector("#" + id));
        return document.querySelector("#" + id);
    }
    exports.findDom = findDom;
}
var obj = {
    "./js/components/utils.ts":(function(module, exports, __webpack_require__){foo()})
}

console.log(obj);

./js/index.js //index 所在目录 path.join
./components/utils     ./js/components/utils.ts
./components/head/utils   ./js/components/head/utils.ts
../common/common   ./common/common.ts


ts.forEachChild(sourceFile, function (node) {
    if (ts.isImportDeclaration(node)) {
        console.log(node);
        let name = node.moduleSpecifier.text
        console.log(name,111111111);
        let modulePaths = resolvedModules.get(name).resolvedFileName
        console.log(modulePaths);
        // moduleRelativePaths.push(name + resolvedModules.get(name).extension) 
        compileTs(modulePaths).then(data=>{
            res.push(data)
        })
        // let data = await compileTs(modulePaths)
        // console.log(data);
        // res.push(data)
        // console.log(res);
    }
});