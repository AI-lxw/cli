let str = `var utils_1 = __webpack_require__("./components/utils");
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./components/utils");
// import utils from './components/head/utils'
var dom = utils_1.findDom("title");
// console.log(utils);
dom.innerHTML = "hello typescript pack";`
var pattern =/[\"|'](.*?)[\"|']/gi;
console.log(str.match(pattern));