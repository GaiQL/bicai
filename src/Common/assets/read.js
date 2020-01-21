let fs = require('fs')

var readDir = fs.readdirSync("./images");
let fileObj = readDir.map((item,index)=>{
    return {
        fullName:item,
        name:item.split('.')[0],
        ext:item.split('.')[1]
    }
})
try {
    fs.writeFileSync('./imagesArr.json',JSON.stringify(fileObj));
    console.log('imagesArr success')
}catch (e) {
    console.log(e)
}

// fs.writeFileSync('./public/static/imagesArr.sass',`'$ImgBase:url(${baseUrl});'`);
