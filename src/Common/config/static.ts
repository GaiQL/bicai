const ImagesArr = require('Common/assets/imagesArr.json')
// const {staticHost} = require('../../web.config.json')

console.log( ImagesArr );
let ImagesObj: any = {}

function getImages(name: string) {
    // if (process.env.NODE_ENV == 'development') {
        console.log( name );
        return require('Common/assets/images/' + name)
    // } else {
    //     return 'https://openapih5test1.bicai365.com/images/' + name
    // return staticHost + '/images/' + name
    // }
}

for (var i = 0; i < ImagesArr.length; i++) {
    ImagesObj[ImagesArr[i].name] = getImages(ImagesArr[i].fullName)
}
export const images = ImagesObj