exports.wrapper = (fileSet, res)=>{
    let fileSetArr = [...fileSet]
    let obj = {}
    let fn = function(content){
        return (function(module, exports, __webpack_require__){content})
    }
    for (let i = 0; i < fileSetArr.length; i++) {
        obj[fileSetArr[i]] = fn(res[i])
    }
    console.log(obj);
}





