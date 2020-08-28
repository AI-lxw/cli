
const rf = require('./lib/readfile').asyncReadFile

let test = async ()=>{
    c =  await rf('./index.css')
    var reg = /url\s*\((\s*\S+\s*)\)\s*?/gi
    // var reg = /\.\.(.*)\.(jpg|png|gif)/
    // var reg=/(?=url\()[^)]+(?=\))/g;
    var r=c.match(reg)
    console.log(r);
    // var alt=/[\"|'](\s*\S+\s*)[\"|'].*?/
    var alt = /[\"|'](.*?)[\"|']/gi
    var patten=/["|'](.*)["|']/;
    uw=c.replace(reg, function(word){
        console.log(word);
        let str = word.replace(alt,function(data){
            let res = data.replace(patten,function(out){
                console.log(out + '1');
            })
        })
        return str
        }
    );
    console.log(uw);
    }
test()