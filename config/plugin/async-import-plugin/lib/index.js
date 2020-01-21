/**

    import PGheihei from 'Common/Pgtest';
    import './style.scss';
    
    class heihei extends PGheihei{
    } 
    
    export default heihei;   

    --------------------------------------------------

    import './style.scss';
  
    export default (async()=>{
        
        const PGheihei = (await import('Common/Pgtest')).default; // webpackChunkName: "Common_Pgtest"
        class heihei extends PGheihei{
        }
        return heihei
        
    })();   

**/
const ts = require("typescript");

let commonImportNodes = [];
let exceptCommonImportNodes = [];
let contentNodes = [];
let exportDefaultText = null;

var createTransformer = function( option ){

    var transformer = function (context) {

        var visitor = function (node) {

            /**
             *  
             *  224    createVariableStatement
             *  declarationList:NodeObject 
             *  
             *  242    createVariableDeclarationList
             *  declarations:Array
             *  
             *  241
             *  [0]:NodeObject  ->  name,initializer
             *  
             *  195
             *  initializer:NodeObject  //初始化器；
             *      kind:195
             *      TonkenObject
             *      expression kind:95
             *      arguments arr[0] kind:10 text:Common/Pgtest
             * 
             *  arguments[0].text = "Common/pgtest"
             * 
            */
  
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

            let pathArr = node.path.split('src/');
            if( pathArr.length >=2 && !/^Common/.test(pathArr[pathArr.length-1]) ){
                ts.visitNode(node, visitor);
            }else{
                return node;
            }

               // text没有改变但 每一个nodeObject改变了

            if( !commonImportNodes.length ){
                return node;
            }

            let newSourceFile = ts.updateSourceFileNode( node,[
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

            return newSourceFile;    // soureFileObj   s
        };
    }

  return transformer

}

exports.createTransformer = createTransformer;
exports.default = createTransformer;
//# sourceMappingURL=index.js.map


/**

    let str = fs.readFileSync('./src/00000/view/test.ts','utf8');

    const resultText = ts.transpileModule(str, {    // program.emit();
    compilerOptions: {
        // target:'esnext'
    },  // ts配置
    fileName:'haha.ts',
    reportDiagnostics: false,
    transformers:{
        before:[
            createTransformer()
        ]
    }
    })

    console.log( resultText.outputText )

 */

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