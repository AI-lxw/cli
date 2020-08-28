var str=`background: center / contain no-repeat url("../../media/examples/firefox-logo.svg"),
#eee 35% url('../../media/examples/lizard.png');
}`   

var pattern =/[\"|'](.*?)[\"|']/gi;
var r=/["|'](.*)["|']/;
console.log(str.match(pattern));
// console.log(str.match(pattern)[0].match(r)[1]+","+str.match(pattern)[1].match(r)[1]);
let res = str.replace(pattern,(data)=>{
    let out = data.replace(r,(out)=>{
        console.log(out.split(/["|']/));
        return `'${out.split(/["|']/)[1]}?v=1.1.0'`
    })
    return out
})
console.log(res);
// console.log(str.match(pattern)[0].match(r)[1])
