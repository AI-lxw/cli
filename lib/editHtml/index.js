const {editLink} = require('./editLink')
const {editBody} = require('./editBody')
exports.editHtml = async (pwd,output,content,version)=>{
    let updateLink = await editLink(pwd, output,content,version)
    let updateImg  = await editBody('body img', updateLink, version)
    let updateScript = await editBody('body script', updateImg, version)
    return updateScript
}