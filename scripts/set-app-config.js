const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

module.exports = (params) => {
    let {
        orgId,
        bankVersion,
        envType
    } = params
    console.log(params);
    var person = fs.readFileSync(path.join(__dirname, './appConfig.json')).toString(); //将二进制的数据转换为字符串
    person = JSON.parse(person); //将字符串转换为json对象

    if (orgId && bankVersion) {
        person.app.orgId = orgId + ""
        person.app.version = bankVersion + ""
        person.app.environment = envType + ""
        var str = JSON.stringify(person); //因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
        fs.writeFile(path.join(__dirname, '../public/appConfig.json'), str, function (err) {
            if (err) {
                console.error(err);
            }
            console.log(chalk.blue('----------appConfig.json修改成功-------------'));
        })
    } else if (orgId){
        person.app.orgId = orgId + ""
        var str = JSON.stringify(person); //因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
        fs.writeFile(path.join(__dirname, '../public/appConfig.json'), str, function (err) {
            if (err) {
                console.error(err);
            }
            console.log(chalk.blue('----------appConfig.json修改成功-------------'));
        })
    }
}
