const path = require("path");
module.exports = {
    pathSwitch:( url ) => {
        // "e:\open-api-bank-all\open-api-bank-3.0-eject\src\common\index.js" \\  -> common_index
        let arr = url.split('src');
        let evolutiveArr = arr[arr.length - 1].split(path.sep);
        let fileName = evolutiveArr[evolutiveArr.length -1];
        // if (/\.(tsx|ts|js|jsx)$/.test(fileName)) {
        //     evolutiveArr[evolutiveArr.length - 1] = fileName.substr(0, fileName.indexOf('.'));
        // }
        return evolutiveArr.filter( e => e!="" ).join('_');
    }
}