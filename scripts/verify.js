const chalk = require('chalk')
const setWebJson = require('./set-web-json') //设置json
const getWebName = require('./get-web-name') //获取当前银行名称
const setAppConfig = require('./set-app-config')
const fs = require('fs')
 
module.exports = function (argv,env) {
  let bank = argv[2];
  let envType = argv[3];
  console.log('⚠️⚠️😳启动格式  npm start/build orgId 启动环境 版本号(start不需要)')
  console.log('⚠️⚠️😳启动格式eg：npm run build 245  test4 1.1.1')
  if (!bank){
    console.log(chalk.red('启动格式错误！------------ npm run build "245" || npm start "245" 😢😢😢😢😢😢'))
    process.exit();return;
  }
  if (!envType) {
    console.log(chalk.red('启动格式错误：设置启动或者打包环境!!'))
    console.log(chalk.red('eg： npm run build 245 test2 1.0.1|| npm start 245 test2😢😢😢😢😢😢'))
    console.log(chalk.red('环境选项：dev / test1 / test2 / test3 / test4 / test5 / pro '))
    process.exit();
  }
  if (bank) {
    let {orgId, bankName} = getWebName(bank)
    if (env == "development") {
      setWebJson({orgId, bankName, envType, envlop: 'development'})
    } else {
      setWebJson({orgId, bankName, envType, envlop: 'production'})
    }
    if (!bank){
      console.log(chalk.red('启动格式错误！------------ npm run build "245" || npm start "245" 😢😢😢😢😢😢'));
      process.exit();
    }
    if (bank) {
      if (fs.readdirSync('src').includes(bank)) {
        //
      } else {
        console.log(chalk.red('找不到当前文件夹名字 请确认输入启服务是否正确！--------------😱😱😱😱😱😱'))
      }
    }
  }
}
