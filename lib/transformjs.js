const fs = require('fs');
const babel = require('@babel/core');
const concatdir = require('./utils').concatdir
const isHttp = require('./utils').isHttp
exports.transform = async (pwd, output, jsSrc) => {
  jsSrc.forEach(item => {
    if (typeof(item) === 'undefined' || isHttp(item)) {
      return
    }
    const filename = `${pwd}${item}`;
    const source = fs.readFileSync(filename, "utf8");
    const { ast } = babel.transformSync(source, { filename, ast: true, code: false });
    const { code } = babel.transformFromAstSync(ast, source, {
      filename,
      presets: [require("@babel/preset-env")],
      babelrc: false,
      configFile: false,
    });
    //创建目录
    concatdir(pwd, output, jsSrc).catch(e=>{console.log(e);})
    
    fs.writeFile(`${pwd}/${output}${item}`,code,'utf8',(err)=>{
      if(err)
          console.log('err'+err);
      else
          console.log('transform js ok');
    })
  });
  
  
};

