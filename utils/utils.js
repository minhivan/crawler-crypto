const { COIN_DETAILS } = require("../constant")

const formatCoinData = (source) => {
    for(let index in source){
        if(source[index] === '' || source[index] == null) delete source[index];
        if(COIN_DETAILS.hasOwnProperty(index)) {
            if(source[index]) {
                if(typeof source[index] === 'object') {
                    var obj = source[index];
                    if(Array.isArray(obj)) {
                        obj = obj.filter(element => element.length > 0)
                    } else {
                        for(let i in obj) {
                            obj[i] = obj[i] ? obj[i] : null
                        }
                    }
                    COIN_DETAILS[index] = obj
                }
                else COIN_DETAILS[index] = source[index]
            }
            else COIN_DETAILS[index] = null
        }
    }
    // var obj = source['market_data'];
    // for(let i in obj) {
    //     console.log(i)
    //     if(obj[i] === '' || obj[i] == null) delete obj[i]
    // }
    // COIN_DETAILS['market_data'] = obj
    console.log(COIN_DETAILS)
    return COIN_DETAILS
}



module.exports = { formatCoinData }