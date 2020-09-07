const fs = require('fs')
const concatdir = async (pwd, output, array)=>{
  console.log(array);
  array.forEach(item=>{
      // if (typeof(item) === 'undefined' || this.isHttp(item)) {
      //     return
      // }
      let arr = item.split('/')
      let dirarr = arr.slice(1,arr.length - 1);
      let str = `${pwd}/${output}`
      const reducer = (acc, cur) => acc + '/' + cur ;
      // console.log(dirarr.reduce(reducer));
      // console.log(dirarr.reduce(reducer, str));
      fs.mkdir(dirarr.reduce(reducer, str),{recursive:true},(e)=>{
          if(e){
              console.log(e);
          }
      });
  })
}
concatdir('/home/lxw/work/project','test',[ '"/footer/img/a.jpg"', '"/footer/css/footer.css"', '"/img/c.jpg"' ])