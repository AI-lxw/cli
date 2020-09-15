// var partten =/require(?=\()/
// let str = "require("
// console.log(str.match(partten));
const path = require('path')
let partten =/(?<=require\()(\s*[\"\'](.+?)[\"\']\s*)/g
content = `
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./components/utils");
var dom = utils_1.findDom("title");
console.log(dom);
dom.innerHTML = "hello typescript pack";`            
content = content.replace(partten,(data)=>{
    data = path.join('js',data.split(/["|']/)[1])
    data = `'./${data}'`
    return data
})
console.log(content,123456);
