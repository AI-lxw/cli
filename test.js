const ts = require('typescript')

var realPath = './js/index.ts'
const program = ts.createProgram([realPath], 
{
    "module": "commonjs",
    "noImplicitAny": true,
    "sourceMap": true,
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
        "*": ["node_modules/*"]
    }
}
)
  const sourceFiles = program
    .getSourceFiles()
    .filter(s => s.fileName === realPath)
console.log(sourceFiles);
  const typeChecker = program.getTypeChecker()

  const result = ts.transform(sourceFiles, [
    generateGenericPropAndState(typeChecker),
    removeImportPropTypes(typeChecker),
    removeStaticPropTypes(typeChecker),
  ])

  const printer = ts.createPrinter()
  const printed = printer.printNode(
    ts.EmitHint.SourceFile,
    result.transformed[0],
    sourceFiles[0]
  )
  const res = prettier.format(printed, {
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    parser: 'typescript',
  })
  console.log(res);