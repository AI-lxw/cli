const fs = require('fs');
const babel = require('@babel/core');
const {concatdir, isHttp} = require('../utils')
const {readfile} = require('../readfile')
exports.compile = async (filename)=>{
  let source = await readfile(filename)
  let code = babel.transform(source, { presets: [require("@babel/preset-env")] }).code
  return code
}
exports.transform = async (pwd, output, jsSrc) =>{
  console.log(jsSrc);
  concatdir(pwd, output, jsSrc).catch(e=>{console.log(e);})
  for (let i = 0; i < jsSrc.length; i++) {
    if (typeof(jsSrc[i]) === 'undefined' || isHttp(jsSrc[i])) return
    let filename = `${pwd}${jsSrc[i]}`;  
    let code = await this.compile(filename) 
    fs.writeFile(`${pwd}/${output}${jsSrc[i]}`,code,'utf8',(err)=>{
      if(err)
          console.log('err'+err);
      else
          console.log('transform js ok');
    })
    
  }
}

