var _webpack = _interopRequireDefault(require("webpack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { Template } = _webpack.default;
const fs = require("fs");
const path = require("path");
const { readFileList,pathSwitch } = require("../config/method");

const commonDirPath = path.resolve(__dirname,'../src/Common');
const indexPath = commonDirPath + '/index.js';
const commonDirContent = readFileList(commonDirPath);

let source = [];

const createCommonIndex = () => {

    commonDirContent.forEach( file => {
        
        let _name = pathSwitch( file );
        const stat = fs.statSync( file );
        const isDirectory = stat.isDirectory();

        // Common/pages/PG...   PgDealDetail;
        if( /Common_pages_Pg/.test( _name ) && isDirectory ){
            if( 
                /PgDealDetail/.test( _name )
                || /PgGetPrdInfo/.test( _name )
                || /PgNativeStatus/.test( _name )
                
            ) return;
            source.push(`import '${_name.split('_').join('/')}'`);
        }

    })

    let indexStr = Template.asString(source);

    fs.writeFileSync( indexPath,indexStr );

}

module.exports = createCommonIndex;