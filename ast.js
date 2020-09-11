
var ts = require("typescript");

function extract(file) {
    var program = ts.createProgram([file], { allowJs: true });
    var sourceFile = program.getSourceFile(file);
    console.log('---------------------------------------');
    var printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    console.log(sourceFile.resolvedModules)
    ts.forEachChild(sourceFile, function (node) {
        
        // if (ts.isImportDeclaration(node)) {
        //     console.log(node);
        //     console.log('-----------------------');
        //     console.log(node.moduleSpecifier.text);
        // }
        
    });

}

extract(process.argv[2]);
