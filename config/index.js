const path = require('path');
const openBank = require('../open.bank')
const rootDir = path.dirname(__dirname);
module.exports = {
    aliasConfig: (() => {
        let openBankPath = {}
        openBank.map((item) => {
            const {orgId} = item
                openBankPath[orgId] = path.resolve(rootDir, 'src', orgId)
        })
        return openBankPath
        // return {
        //     "203": path.resolve(rootDir, 'src', '203'),
        // }
    })()
}