const { COIN_DETAILS } = require("../constant")

const formatCoinData = (source) => {
    for(let index in source){
        if(source[index] === '') delete source[index]
        console.log(source[index].length)
        // if(source[index].length === 0) delete source[index];
        if(typeof source[index] === 'object') {
            for(let i in source[index]) {
                if(!source[index][i]) source[index][i] = null;
            }
        }
        COIN_DETAILS[index] = source[index]
    }
    //console.log(COIN_DETAILS);
    return COIN_DETAILS
}

module.exports = { formatCoinData }