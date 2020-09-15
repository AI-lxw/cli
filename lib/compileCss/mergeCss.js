const {makedir} = require('../utils')
exports.merge = async (page, pwd, version, output)=>{
    await makedir(`${pwd}/${output}/css`)
}