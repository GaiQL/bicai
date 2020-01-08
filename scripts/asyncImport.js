const fs = require("fs");
const ts = require("typescript");

// babel.loadOptions({
//     presets:null
// })
let str = fs.readFileSync('./src/00000/view/test.ts','utf8');
// console.log( str );

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

let commonImportNodes = [];
let exceptCommonImportNodes = [];
let contentNodes = [];
let exportDefaultText = null;

var transformerWrapper = function( option ){

  var transformer = function (context) {

    var visitor = function (node) {
  
      if ( ts.isSourceFile(node) ) {   // SourceFileObject  源文件对象  NodeObject 
        return ts.visitEachChild(node, visitor, ts.nullTransformationContext);  
      }
      if ( ts.isExportAssignment(node) && node.symbol.name == "default" ) {
        exportDefaultText = node.expression.text;return;
      }
      if ( !ts.isImportDeclaration(node) ) {
        contentNodes.push(node);return;
      }

      let importedLibName = node.moduleSpecifier.text;  // specifier 说明符，指示语 
      if( !/^Common\//.test(importedLibName) ) {
        exceptCommonImportNodes.push(node);return;
      }
      
      let importClauseName = node.importClause.name.text;
      let scirptsNode = ts.createVariableStatement(
          undefined,
          ts.createVariableDeclarationList([
              ts.createVariableDeclaration(
                  importClauseName,
                  undefined,
                  ts.createPropertyAccess(  // 193
                    ts.createParen(
                      ts.createAwait(
                        ts.createCall(
                            ts.createNode(95),   // 199 205 IdentifierObject 向恶势力低头...  
                            /*typeArguments*/ undefined, 
                            [
                              ts.addSyntheticLeadingComment(
                                ts.createStringLiteral(`${importedLibName}`),
                                3,
                                `webpackChunkName:"${importedLibName.split('/').join('_')}"`
                              )
                            ]
                        )
                      )
                    ),
                    `default`
                  )
              ),
          ],1)
      )

      commonImportNodes.push(scirptsNode);
    }
    
    return function (node) {

      ts.visitNode(node, visitor);   // text没有改变但 每一个nodeObject改变了

      let heihei = ts.updateSourceFileNode( node,[
        ...exceptCommonImportNodes,
        ts.createExportAssignment(
          /*decorators*/ undefined, 
          /*modifiers*/ undefined, 
          /*isExportEquals*/ false, 
          ts.createCall(
            ts.createParen(
              ts.createArrowFunction(
                /*modifiers*/ ts.createModifiersFromModifierFlags(256), 
                /*typeParameters*/ undefined,
                /*parameters*/ [],
                /*type*/ undefined,
                /*equalsGreaterThanToken*/ undefined,
                ts.createBlock(
                  ts.createNodeArray([ ...commonImportNodes,...contentNodes,ts.createReturn( ts.createIdentifier( exportDefaultText ) ) ])
                )
              )
            ),
            /*typeArguments*/ undefined, 
            []
          )
        )
      ] )

      console.log( node );
      // console.log( heihei.getText() );

      return heihei;    // soureFileObj   s
    };
  }

  return transformer

}

const resultText = ts.transpileModule(str, {    // program.emit();
  compilerOptions: {
    target:'esnext'
  },  // ts配置
  fileName:'haha.ts',
  reportDiagnostics: false,
  transformers:{
    before:[
      transformerWrapper()
    ]
  }
})

console.log( resultText.outputText )

/**
 * ts.transpileModule
 * 
 * compilerHost = {...writerFile = function(name.text){
 *  outputText = text
 * }}
 * 
 * var program = ts.createProgram([inputFileName], options, compilerHost);
 * 
 * program.emit(  ...,transpileOptions.transformers  )
 * 
 */

 /**
  * 
  * kind 258    expression - NodeObject  symbol - SymbolObject   
  * expression
  *   kind 195
  *   expression 
  *     kind 199
  *     expression
  *       kind 201
  *       body  ->  statement [3]
  *       equalsGreaterThanToken  TokenObject
  *       flowNode
  *       nextContainer -> name:heihei
  *       symbol -> name -> function
  * 
  * symbol
  *   declarations
  *   name:default
  * 
  */

