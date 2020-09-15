const {urlVersion} = require('../utils')
const {saveData} = require('../compileCss/saveData')
exports.addVersion = async (_path, dir, ext, version)=>{
    let content = await (await saveData(_path, dir, ext)).content
    content = await urlVersion(content, version)
    return content
}