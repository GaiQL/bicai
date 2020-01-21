
const path = require('path');
const fs = require('fs');
const { pathSwitch } = require("../method");
let commonFiles = [];

const readFileList = (dir) => {

  const files = fs.readdirSync(dir);
  files.forEach((item) => {
    var fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {

        // Common/Pages/Pg..  Comoon_pages_pag..
        if (/^Pg/.test(item)) {
          let name = pathSwitch( fullPath );
          commonFiles.push({
            name,
            test: module => new RegExp( item ).test( module.resource )
          });
          return;
        }
        readFileList(path.join(dir, item));

    } else {

        // let name = pathSwitch( fullPath ); //  Common_Pgtest_index.tsx;
        // if (name.split('_')[1] == 'index.js') return;
        // if( /index/.test( fullPath ) ) return;
        // if( /scss$/.test( fullPath ) ) return;
        // commonFiles.push({
        //   name,   // 确定chunk name；
        //   test: (module) => {  // 确定chunk 中的module；

        //     /*
        //     resource:
        //     "e:\open-api-bank-all\open-api-bank-3.0-eject\src\Common\index.js"
        //     "e:\open-api-bank-all\open-api-bank-3.0-eject\src\Common\Pgtest\index.tsx"
        //     "e:\open-api-bank-all\open-api-bank-3.0-eject\src\Common\Pgtest\style.scss"
        //     "e:\open-api-bank-all\open-api-bank-3.0-eject\src\Common\Pgtest\store.ts"
        //     "e:\open-api-bank-all\open-api-bank-3.0-eject\src\Common\utils\method.ts"
        //     */ 
        //     if( /Common/.test( module.resource ) ){
        //       return module.resource == fullPath;
        //     }

        //   }
        // });

    }
  });

}

readFileList(path.resolve(__dirname, '../../src/Common'));

let cacheGroups = {};
commonFiles.forEach((item) => {
  let {
    name,
    test
  } = item;
  cacheGroups[item.name] = {
    name,
    test,
    minSize: 0,
    minChunks: 1,
    priority: 0
  }
})

module.exports = cacheGroups;