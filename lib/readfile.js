
const fs = require('fs');
let readFile = function (fileName){
    return new Promise(function (resolve, reject){
        fs.readFile(fileName,'utf8', function(error, data){
            if (error) reject(error);
            resolve(data);
        });
    });
};
exports.asyncReadFile = async function (fileName){
    let data = await readFile(fileName);
    return data.toString()
};
