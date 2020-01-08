import heihei from './view/view.ts'

console.log( heihei );      
const num = heihei.then(( res )=>{
    console.log( res )       
})   
   
// const linkHrefPath = `"static/css/" + ({"1":"Common_test"}[chunkId]||chunkId) + "." + {"1":"842be006"}[chunkId] + ".chunk.css"`;
    
// let linkHrefPathArr = linkHrefPath.split('+');
// let chunkNamePart = linkHrefPathArr[1]
// const chunkNameStore = chunkNamePart.substr( chunkNamePart.indexOf('{'),chunkNamePart.indexOf('}')-1 );
// // linkHrefPath;
// // ;

// linkHrefPathArr[0] = `/Common_/.test(currenChunkName)?"../Common/css/":"static/css/"`;
// linkHrefPathArr[1] = `currenChunkName`
// const linkHrefPathTransition =  linkHrefPathArr.join('+');

// console.log( linkHrefPathTransition )
