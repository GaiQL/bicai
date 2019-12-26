const setWebJson = require('./set-web-json');
const getWebName = require('./get-web-name');

const bankId = process.argv[2];
const envType = process.argv[3];

let { orgId, bankName } = getWebName( bankId );
setWebJson({ orgId, bankName, envType, envlop: 'development' });

