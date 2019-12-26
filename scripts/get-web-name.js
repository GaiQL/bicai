let bankList = require('../open.bank')
module.exports = (id) => {
    let obj = bankList.map(item => {
        if (item.orgId == id) {
            return item
        }
        return null
    }).filter(item => item)
    return obj[0]
}