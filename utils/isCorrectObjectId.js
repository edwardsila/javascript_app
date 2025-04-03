/**
 * 
 * @param {String} id 
 * @returns {boolean}
 */
function isCorrectObjectId(id){
    if(!id){
        return false;
    }
    if(typeof(id) != 'string'){
        return false;
    }
    if(id.length != 24){
        return false;
    }
    return true
}

module.exports = isCorrectObjectId;