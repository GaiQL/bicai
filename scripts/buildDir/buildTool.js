const readline = require('readline');
const setWebJson = require('../set-web-json');
const getWebName = require('../get-web-name');
const fs = require('fs');
const path = require('path');

const tools = {

    readInputText: (tips) => {
  
        tips = tips || '> ';
        return new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
      
            rl.question(tips, (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });
      
    },
    deleteDir : (url) => {

        if( fs.existsSync(url) ) {
      
            if( /.zip$/.test(url) ){ fs.unlinkSync(url);return; }
      
            let files = fs.readdirSync(url);
            files.forEach(function(file,index){
      
                let curPath = path.join( url,file );
                if( fs.statSync(curPath).isDirectory() ) {
                    tools.deleteDir(curPath);
                } else {
                    fs.unlinkSync(curPath); 
                }
                    
            });
            fs.rmdirSync(url); 
        }
      
    },
    copyFolder : ( oldPath, newPath ) => {

        let files = [];
        if (fs.existsSync(newPath)) {
            files = fs.readdirSync(oldPath);
            files.forEach(function (file, index) {
                var targetPath = oldPath + "/" + file;
                var toPath = newPath + '/' + file;
                if (fs.statSync(targetPath).isDirectory()) {
                    tools.copyFolder(targetPath, toPath);
                } else {
                    fs.copyFileSync(targetPath, toPath);
                }
            });
        } else {
            fs.mkdirSync(newPath);
            tools.copyFolder(oldPath, newPath);
        }
      
    },
    calculateVersion:( h5Version,appVersion )=>{

        let defaultVersion = ['1','0','0'];
        let appVersionArr = appVersion?appVersion.split('.'):defaultVersion;
        let h5VersionArr = h5Version?h5Version.split('.'):defaultVersion;
        let relativelyHeightArr = null;
      
        appVersionArr.some(( e,i )=>{
      
          if( Number(e) < Number(h5VersionArr[i]) ){
            relativelyHeightArr = h5VersionArr
            return true;
          }else if( Number(e) > Number(h5VersionArr[i]) ){
            relativelyHeightArr = appVersionArr
            return true;
          }
          
        })
      
        if( !relativelyHeightArr ){ relativelyHeightArr = appVersionArr };
        relativelyHeightArr = relativelyHeightArr.map( e => Number( e ) );
        let currentNum = relativelyHeightArr.length - 1;
        let numLimit = 20;
        let upgradeOnoff = false;
        let calculateVersion = () => {
          if( !currentNum ){
            upgradeOnoff?++relativelyHeightArr[currentNum]:null;
            return;
          }
          if( upgradeOnoff ){ ++relativelyHeightArr[currentNum] };
          if( ( upgradeOnoff?relativelyHeightArr[currentNum]:relativelyHeightArr[currentNum] + 1 ) > numLimit ){
            relativelyHeightArr[currentNum] = 0;
            upgradeOnoff = true;
          }else{
            if( currentNum == relativelyHeightArr.length - 1 ){ ++relativelyHeightArr[currentNum] };
            upgradeOnoff = false;
          }
          --currentNum;
          calculateVersion()
        }
        calculateVersion();
        
        return relativelyHeightArr.join('.')

    },
    resetEnv:( bankId,envType )=>{
        console.log('切换回开发环境');
        let { orgId, bankName } = getWebName( bankId );
        setWebJson({ orgId, bankName, envType, envlop: 'development' });
    }
 

}

module.exports = tools;