const babel = require("@babel/core");
const fs = require("fs");
const ts = require("typescript");

// babel.loadOptions({
//     presets:null
// })
let str = fs.readFileSync('./src/Common/utils/method.ts','utf8');
// console.log( str );
var result = babel.transformSync("code();", {});

// function printAllChildren(node, depth = 0) {
//     console.log(new Array(depth + 1).join('----'), ts.formatSyntaxKind(node.kind), node.pos, node.end);
//     depth++;
//     node.getChildren().forEach(c => printAllChildren(c, depth));
// }
  
// var sourceCode = `
// var foo = 123;
// `.trim();

var sourceFile = ts.createSourceFile('foo.ts', str, ts.ScriptTarget.ES5, true);
// printAllChildren(sourceFile);

console.log( sourceFile );
sourceFile.statements.forEach(( node )=>{

  // var importedLibName = node.moduleSpecifier.text;

  console.log( ts.isFunctionDeclaration(node) );

})
// console.log( sourceFile )

// const node = ts.visitEachChild(sourceFile, visitor, ctx)

// function visitor(node) {
//   if(node.getChildCount()) {
//     return ts.visitEachChild(node, visitor, ctx)
//   }
//   return node
// }
// console.log( node );


