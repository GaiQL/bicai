const child_process = require('child_process');
// const SMB2 = require("smb2");
// const SambaClient = require('samba-client');
const fs = require('fs');
const archiver = require('archiver');
const getWebName = require('../get-web-name');
const buildPathJson = require('./buildPath.json');

const bankId = process.argv[2];
const envType = process.argv[3];
const buildTarget = process.argv[4]?process.argv[4]:"apph5";
const bankVersion = process.argv[5]?process.argv[5]:"auto";

let python3 = child_process.spawnSync( 'python3', [`-V`] );
let pythoncommand = "";
if( python3.stdout ){
  pythoncommand = /3/.test( python3.stdout.toString() )?'python3':'python';
}else{
  pythoncommand = 'python';
}

// 银行校验；
let bankInfo = getWebName( bankId );
if( !bankInfo ){ console.log("不支持的银行");return; }

// 版本号校验； 
let formatOnoff = false;
try{

  if( bankVersion != "auto" ){
    let bankVersionArr = bankVersion.split('.');
    if( bankVersionArr.length != 3 ){ throw Error };
    bankVersionArr.forEach(( e )=>{
      if( isNaN(e) ) throw Error;
    })
  }

}catch(err){ formatOnoff = true; }
if( formatOnoff ){ console.log("不支持的版本号格式");return; };

// 环境更改和校验
let envTypeInManage = "";
switch (envType) {
  case 'graytest':envTypeInManage = 'preheat';break;
  case 'pro':envTypeInManage = 'prod';break;
  default:envTypeInManage = envType;break;
}
let pathData = buildPathJson[ envTypeInManage ];
try{
  let num = Object.keys( pathData ).length;
}catch( err ){
  console.log(envTypeInManage+'不支持的环境');process.exit();return;
}

let { deleteDir,copyFolder,calculateVersion,resetEnv,readInputText } = require('./buildTool');
let requestApi = require('./buildRequest');

// 发版控制
let versionOnoff = { appOnoff:true,h5Onoff:true };
if( !/h5/.test( buildTarget ) ){ versionOnoff.h5Onoff = false };
if( !/app/.test( buildTarget ) ){ versionOnoff.appOnoff = false };
if( envTypeInManage == "prod" ){ versionOnoff.h5Onoff = false };

requestApi = new requestApi( envTypeInManage );

let warFilePath = `./${ bankId }`;
let zipFilePath = `${ warFilePath }.zip`;
let appListContent = null;
let h5Config = null;

const getVersion = async () => {

  // 获取 app 版本号：
  let appVersion = null;
  if( versionOnoff.appOnoff ){
      let pageLimit = 10;
      let pageNum = 1;
      await requestApi.login();
      const getAppVersion = async () => {
      
        let listData = await requestApi.list(pageNum,pageLimit);
        if( !listData.data.length ){ return };
        listData.data.forEach(( e,i )=>{
          if( e.orgId == bankId && e.status == envTypeInManage ){
            appListContent = e;
            appVersion = e.version;
          }
        })
        if( !appListContent ){ ++pageNum;await getAppVersion() };
    
      }
      await getAppVersion();
      console.log( `app版本：${ appVersion?appVersion:'无' }` );
  }

  // 获取 h5 版本号：
  let h5Version = null;
  if( versionOnoff.h5Onoff ){
      child_process.spawnSync(
          pythoncommand, 
          [`${__dirname}/build_getVersion.py ${bankId} ${envTypeInManage}`], 
          { stdio: 'inherit',shell: true }
      )

      let appConfigPath = `${__dirname}/appConfig.json`;
      if( fs.existsSync( appConfigPath ) ){
        h5Config = fs.readFileSync(appConfigPath,'utf8');
        h5Version = h5Config?JSON.parse(h5Config).app.version:null
        fs.unlinkSync(appConfigPath);
      }
      console.log( `H5版本：${ h5Version?h5Version:'无' }` );
  }

  // 计算版本号
  return calculateVersion( h5Version,appVersion )
  
}

(async () => {

  // let reconfirmList = [{ envType:'graytest',name:'灰度环境' },{ envType:'pro',name:'生产环境' }];

  // for( let i=0;i<reconfirmList.length;i++ ){
  //   if( envType == reconfirmList[i].envType ){
  //     cliText = await readInputText(`确定打包 ${bankInfo.bankName} ${reconfirmList[i].name}么(y/n):`);
  //     if( cliText != 'y' && cliText != 'Y' ){ process.exit();return; }
  //     break;
  //   }
  // }

  // let version = bankVersion == "auto"?await getVersion():bankVersion;

  // console.log( `此次打包版本：${ version }\n` )

  // // 删除本地文件
  // deleteDir( './build' );
  // deleteDir( warFilePath );
  // deleteDir( zipFilePath );

  // child_process.spawnSync(
  //   'react-app-rewired', 
  //   [`build ${bankId} ${envType} ${version}`], 
  //   { stdio: 'inherit',shell: true }
  // )

  // // build重命名
  // try{
  //   fs.renameSync( './build', warFilePath );
  // }catch( err ){
  //   console.log( err );process.exit();
  // }

  // h5上传；
  if( versionOnoff.h5Onoff ){
    child_process.spawnSync(
      pythoncommand, 
      [`${__dirname}/build_upload.py ${bankId} ${envTypeInManage}`], 
      { stdio: 'inherit',shell: true }
    )
    console.log( '\nh5发版成功' )
  }

  // 压缩文件 app上传；
  if( !versionOnoff.appOnoff ){ resetEnv( bankId,envType );return; }
  let temporaryDirName = './temporaryDir';
  if ( fs.existsSync( temporaryDirName ) ) {
    try{
      deleteDir( temporaryDirName );
    }catch(err){
      
    }
  }
  fs.mkdirSync( temporaryDirName );
  fs.mkdirSync( `${temporaryDirName}/${bankId}` );
  
  copyFolder( warFilePath,`${temporaryDirName}/${bankId}` );

  let output = fs.createWriteStream( `./${bankId}.zip` );
  let archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', function() {

    deleteDir( temporaryDirName );

    console.log( '压缩完成 ' + archive.pointer() + ' total bytes' );
  
    let totalLength = 0;
    let bufferArr = [];
  
    let readStream = fs.createReadStream( zipFilePath );
    readStream.on('data', function( buffer ) {     //65536      //131701
  
      bufferArr.push( buffer );
      totalLength += buffer.length;
      // client.write( buffer ) 
      
    });
    readStream.on('end', async function() {
      
      let fileContent = Buffer.concat( bufferArr , totalLength ).toString('base64');

      await requestApi.login();
      let postData = {
        downloaUrl: "data:application/x-zip-compressed;base64," + fileContent,
        fileName: bankId + ".zip",
        orgId: bankId,
        remarks: "",
        status: envTypeInManage,
        version
      }
      if( appListContent ){ postData.id = appListContent.id }
      let uploadData = await requestApi.upload( appListContent,postData );

      console.log( uploadData )
      if( !Object.keys( uploadData ).length ){
        let message = appListContent?'列表id-' + appListContent.id:'新增';
        console.log( 'app发版成功：' + message )
      }else{
        process.exit();
      }

      resetEnv( bankId,envType );
      
    });
    readStream.on('error', function( error ){ console.error('readStream error:', error.message) })

  });

  output.on('end', function() { console.log('Data has been drained'); });

  archive.on('warning', function(err) { if (err.code === 'ENOENT') { } else { throw err; } });

  archive.on('error', function(err) { throw err; });

  archive.pipe(output);

  archive.directory('temporaryDir/', false);
  // archive.directory(`${bankId}/`, `${bankId}`);

  archive.finalize();

})();
