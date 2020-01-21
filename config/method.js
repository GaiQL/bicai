const path = require("path");
const fs = require("fs");
module.exports = {
    pathSwitch:( url ) => {
        // "e:\open-api-bank-all\open-api-bank-3.0-eject\src\common\index.js" \\  -> common_index
        let arr = url.split('src');
        let evolutiveArr = arr[arr.length - 1].split(path.sep);
        let fileName = evolutiveArr[evolutiveArr.length -1];
        if (/\.(tsx|ts|js|jsx)$/.test(fileName)) {
            evolutiveArr[evolutiveArr.length - 1] = fileName.substr(0, fileName.indexOf('.'));
        }
        return evolutiveArr.filter( e => e!="" ).join('_');
    },
    createDir:( fs,path )=>{
        let exists = fs.existsSync( path );
        if( !exists ){ fs.mkdirpSync( path ) }
    },
    readFileList:(dirpath) => {
        let fileList = [];
        const readFn = ( dir ) => {
            const files = fs.readdirSync(dir);
            files.forEach((item) => {
                var fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    fileList.push( fullPath );
                    readFn(path.join(dir, item));
                } else {
                    fileList.push( fullPath );
                }
            });
        }

        readFn( dirpath );
        return fileList;
    }
}