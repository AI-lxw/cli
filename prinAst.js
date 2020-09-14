const ts = require("typescript");

function makeFactorialFunction() {
  return (
    ts.createVariableStatement(
      undefined,
      ts.createVariableDeclarationList(
        [ts.createVariableDeclaration(
          ts.createIdentifier("utils_1"),
          undefined,
          ts.createCall(
            ts.createIdentifier("__webpack_require__"),
            undefined,
            [ts.createStringLiteral("./js/components/head/utils.ts")]
          )
        )],
        ts.NodeFlags.None
      )
    )
  )
}

const resultFile = ts.createSourceFile("dsad.ts", "", ts.ScriptTarget.Latest, /*setParentNodes*/ false, ts.ScriptKind.TS);
console.log(resultFile);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
console.log(printer);
const result = printer.printNode(ts.EmitHint.Unspecified, makeFactorialFunction(), resultFile);
console.log(result);