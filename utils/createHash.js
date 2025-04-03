const crypto = require('crypto')
class HashSettings{
    /**
     * 
     * @param {Number} length 
     * @param {Number} encoding 
     */
    constructor(length, encoding){
        this.encoding = encoding;
        this.length = length
    }
}
/**
 * 
 * @param {HashSettings} param0 
 * @returns 
 */
function createHash({length, encoding}){
    if(!length){
        length = 8;
    }

    if(!encoding){
        encoding = 16
    }
    if(encoding > 36){
        return  new Error('encoding cannot be greater than 36')
    }

    let str = []
    for(let i = 0; i<length; i++){
        const accessKey = crypto.randomBytes(1).toString('hex');

        let int = parseInt(accessKey, 16);
        str.push((int.toString(encoding)));
    }
    return str.join('').slice(0, length)
}

module.exports = createHash;