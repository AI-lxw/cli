const fs = require('fs');
const concatdir = require('./utils').concatdir
const isHttp = require('./utils').isHttp
exports.copy = async (pwd, output, imageArr)=>{
  function callback(err) {
    if (err) throw err;
    console.log('copy img successfully');
  }
  concatdir(pwd, output, imageArr)
  imageArr.forEach(item => {
    if (typeof(item) === 'undefined' || isHttp(item)) return
    fs.copyFile(`${pwd}${item}`, `${pwd}/${output}${item}`, callback);
  });
}
