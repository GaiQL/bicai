let fs = require('fs')
let path = require('path')
var readDir = fs.readdirSync(path.resolve(__dirname,"../src/Common/assets/images"));
let fileObj = readDir.map((item,index)=>{
    return {
        fullName:item,
        name:item.split('.')[0],
        ext:item.split('.')[1]
    }
})

try {
    fs.writeFileSync(path.resolve(__dirname,"../src/Common/assets/images"),JSON.stringify(fileObj),'utf-8');
    console.log('imagesArr success')
}catch (e) {
    console.log(e)
}
// fs.writeFileSync('./public/static/imagesArr.sass',`'$ImgBase:url(${baseUrl});'`);
