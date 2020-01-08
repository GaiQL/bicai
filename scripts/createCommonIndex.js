const fs = require("fs");
const path = require("path");

const commonDir = fs.readdirSync(path.resolve(__dirname,'../src/Common'));

console.log( commonDir )