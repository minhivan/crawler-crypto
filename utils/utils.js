const { COIN_DETAILS } = require("../constant")

const formatCoinData = (source) => {
    for(let index in source){
        if(source[index] === '' || source[index] == null) delete source[index];

        if(COIN_DETAILS.hasOwnProperty(index)) {
            if(source[index]) {
                if(typeof source[index] === 'object') {
                    let obj = source[index];
                    if(Array.isArray(obj)) {
                        obj = obj.filter(element => element.length > 0)
                    } else {
                        for(let i in obj) {
                            if(i) {
                                obj[i] = obj[i] ? obj[i] : null
                            } else {
                                delete obj[i];
                            }
                        }
                    }
                    // after formatting
                    COIN_DETAILS[index] = obj
                }
                else COIN_DETAILS[index] = source[index]
            }
            else COIN_DETAILS[index] = null
        }
    }
    console.log(COIN_DETAILS)
    return COIN_DETAILS
}


const testFormatCoinData =  (source ) => {
    let object = source['platforms'];
    if (Array.isArray(object)) {
        object = object.filter(element => element.length > 0)
    } else {
        for(let i in object) {
            if(i) {
                console.log(i)
                object[i] = object[i] ? object[i] : null
            } else {
                delete object[i];
            }
        }
    }
    console.log(object)

    return COIN_DETAILS
}


module.exports = { formatCoinData , testFormatCoinData }