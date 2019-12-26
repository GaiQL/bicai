const mammoth = require("mammoth");
// const officegen = require('officegen')
const fs = require("fs");
const path = require("path");
const child_process = require('child_process');

const bankId = process.argv[2];
const docsType = process.argv[3];
const fileList = process.argv[4];

let baseUrl = `./src/${bankId}/docs/`;

switch ( docsType ) {
    case "jy":baseUrl+='jy/';break;
    case "kh":baseUrl+='kh/';break;
    default:console.log("不支持的类型");process.exit();
}

let options = { includeDefaultStyleMap: false };

const getStrLength = ( str ) => {
    let processStr = "";
    processStr = str.replace(/[\u0391-\uFFE5]/g,"aa");
    return processStr.length;
}

function str2ab(s,f) {
        var b = new Blob([s],{type:'text/plain'});
        var r = new FileReader();
        r.readAsArrayBuffer(b);
        r.onload = function (){if(f)f.call(null,r.result)}
}

const action = ( name ) => {

    return new Promise(( res,rej )=>{

        let html = null;

        if( /.html/.test(name) ){
            return; 
        }
    
        if( /.docx/.test(name) ){

            mammoth.convertToHtml( { path: `${baseUrl}${name}` },options )
            .then(function(result){
        
                html = result.value + "";
                let messages = result.messages;
        
                html = html.replace(/<p>/,"<h3>");
                html = html.replace(/<\/p>/,"</h3>");
                
                html = html.split('</p>').join('</p>\n');
        
                res( html );
        
            })
            .catch(( err )=>{  })
            .done();
        
        }else{
    
            console.log("不支持的格式");return;
    
        }

    })

}

let files = fs.readdirSync(baseUrl);

if( fileList ){ files = fileList.split(',') };

let data = fs.readFileSync("./docsTemplate.html", 'utf-8');

files.forEach(async ( e )=>{

    let html = await action( e );

    let splitStr = '<div class="box">';
    let splitArr = data.split(splitStr);
    let prepareData = splitArr[0] + splitStr + '\n\n\n' + html + splitArr[1];

    let htmlUrl = `${baseUrl}${ e.split('.').slice(0,-1).join('.') }.html`;
    fs.writeFileSync( htmlUrl,prepareData );

    console.log(`转换成功${ htmlUrl }`);
    
});

// else if( /.doc/.test(name) ){

//     // textract  doc-antiword

//     let filePath = `${baseUrl}${name}`;

//     child_process.exec( 'antiword -f "' + filePath + '"',{},function( error, stdout /* , stderr */ ){
//         let err;
//         if ( error ) {
//             if ( error.toString().indexOf( 'is not a Word Document' ) > 0 ) {

//                 err = new Error( 'file named [[ ' + path.basename( filePath ) +
//                 ' ]] does not appear to really be a .doc file \n' +
//                 '抛出这个错误的话就 新建一个文件 然后把内容复制过去吧...'
//                 );
//             } else {
//                 err = new Error( 'antiword read of file named [[ ' +
//                 path.basename( filePath ) + ' ]] failed: ' + error );
//             }
//             console.log( err );
//         } else {
            
//             // 无非选中的内容获取不到
//             let textArr = stdout.trim().split('\r\n');
//             html = "";
//             textArr.forEach(( lineStr,index )=>{
        
//                 let nextLineStr = textArr[index + 1]?textArr[index + 1]:"";
//                 let lastLineStr = textArr[index - 1]?textArr[index - 1]:"";
//                 let maxTextNum = 76;
        
//                 if( index == 0 ){ html += "<h3>" + lineStr + "</h3>" }
        
//                 if( /^  /.test( lineStr ) ){
//                     html += "<p>" + lineStr
//                 }else{
//                     if( getStrLength( lastLineStr ) >= maxTextNum ){
//                         html += lineStr;
//                     }else{
//                         // html += "<p style='text-indent:0'>" + lineStr;
//                         html += "<p>" + lineStr;
//                     }
//                 }
        
//                 if( getStrLength( lineStr ) < maxTextNum || /^ /.test( nextLineStr ) ){
//                     html += "</p>\r\n";
//                 }
                
//             })
//             res( html );

//         }
//     });

// }