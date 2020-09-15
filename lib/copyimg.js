const fs = require('fs');
const {concatdir, isHttp} = require('./utils')
exports.copyImg = async (pwd, output, imageArr)=>{
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
