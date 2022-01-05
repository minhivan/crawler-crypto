const { COIN_DETAILS, COIN_MARKET_CHART, COIN_TICKERS, COIN_MARKETS, COIN_LIST} = require("../constant")

const formatDataFunc = (constant, source) => {
    let formatData = {};
    switch (constant) {
        case 'detail' :
            formatData = COIN_DETAILS;
            break;

        case 'ticker':
            formatData = COIN_TICKERS;
            break;

        case 'market_chart':
            formatData = COIN_MARKET_CHART;
            break;

        case 'market':
            formatData = COIN_MARKETS;
            break;

        case 'coin_list':
            formatData = COIN_LIST;
            break;

        default :
            return false;
    }
    // looping response and reformat

    // Object.keys(formatData).forEach(index => {
    //     formatData[index] = clearEmpties(source[index])
    // })

    testTransformData(source, formatData)
    return formatData
}




const clearEmpties = ( source ) => {

    if(source === '' || source == null) {
        return null
    }
    if(typeof source === 'object') {
        if(Array.isArray(source)) {
            source = source.filter(element => {
                if(element === '' || element == null) return null;
                if(typeof element === "object") {
                    Object.keys(element).forEach(key => {
                        if (key === '' || key == null)  delete element[key]
                        if (element[key] === '' || element[key] == null) element[key] = null
                        if (Number.isInteger(element[key])) {
                            element[key] = Math.floor(element[key]).toFixed(6);
                        }
                        if (Math.log10(element[key]) > 19) {
                            // o[k] =  Math.floor(o[k]) + 0.0000001;
                            return null
                        }
                    });
                    return element
                }
                return element
            })
        } else {
            Object.keys(source).forEach(i => {
                if(i === '' || i == null)  delete source[i];
                else {
                    if(Array.isArray(source[i])) {
                        source[i] = source[i].filter(element => element)
                    }
                    if(source[i] === '' || source[i] == null) source[i] = null
                }
            });
        }
    }
    
    return source
}


const testTransformData = (source, data) => {
    for (let index in data) {
        if(source[index] === '' || source[index] == null) data[index] = null
        if(typeof source !== 'object') {
        
        }
    }
}




// format data for coin ticker
const formatNumber = (number) => {
    return  Math.floor(number).toFixed(6);
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