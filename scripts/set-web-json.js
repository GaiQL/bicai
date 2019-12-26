const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

module.exports = (params) => {
    let {orgId, bankName, envType, envlop} = params
    fs.readFile(path.join(__dirname, './web.config.json'), function (err, data) {
        if (err) {
            return console.error(err);
        }
        var person = data.toString(); //将二进制的数据转换为字符串
        person = JSON.parse(person);//将字符串转换为json对象

        if (person.orgId != orgId) {
            person.orgId = orgId + ""
            person.orgName = bankName + ""
            if (envlop == 'development') {
                person.envType.dev = envType
            } else {
                person.envType.dev = person.envType.dev ? person.envType.dev : envType
                person.envType.pro = envType
            }
            var str = JSON.stringify(person);//因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
            fs.writeFile(path.join(__dirname, '../src/web.config.json'), str, function (err) {
                if (err) {
                    console.error(err);
                }
                console.log(chalk.blue('----------web.config.json修改成功-------------'));
            })
        }
    })
}
