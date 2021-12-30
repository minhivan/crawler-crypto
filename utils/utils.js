const { COIN_DETAILS, COIN_MARKET_CHART, COIN_TICKERS, COIN_MARKETS } = require("../constant")

const formatDataFunc = (constant, source) => {
    let formatData = {};
    switch (constant) {
        case 'detail' :
            formatData = COIN_DETAILS;
            break;

        case 'ticker':
            formatData = COIN_TICKERS;
            break;
        default :
            return false;
    }
    Object.keys(source).forEach(index => {
        if(index === '' || index == null) delete source[index];
        if(formatData.hasOwnProperty(index)) formatData[index] = clearEmpties(source[index])
    });

    // console.log(formatData['tickers'])
    return formatData
}




const clearEmpties = ( source ) => {
    if(!source || source === '' || source == null) {
        return null
    }
    // if source is array => filter empty array
    if(Array.isArray(source)) {
        source = source.filter(element => {
            if(typeof element === "object") {
                Object.keys(element).forEach(key => {
                    if(key === '' || key == null)  delete element[key];
                    if(element[key] === '' || element[key] == null) element[key] = null
                });
                return element
            }
            else return element.length > 0
        })
    } else {
        // if source is object
        // check value from key
        if(typeof source === 'object') {
            Object.keys(source).forEach(i => {
                if(i === '' || i == null)  delete source[i];
                else {
                    if(Array.isArray(source[i])) {
                        source[i] = source[i].filter(element => element.length > 0)
                    }
                    if(source[i] === '' || source[i] == null) source[i] = null
                }
            });

        }
    }
    return source;
}



const testFormatCoinData =  (source) => {
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
                                if(Array.isArray(obj))
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
    //console.log(COIN_DETAILS)
    return COIN_DETAILS
}


module.exports = { formatDataFunc , testFormatCoinData }