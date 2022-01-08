const { COIN_DETAILS, COIN_MARKET_CHART, COIN_TICKERS, COIN_MARKETS, COIN_LIST} = require("../constant")

const formatDataFunc = (constant, source) => {
    var formatData;

    switch (constant) {
        case 'detail' :
            formatData = Object.assign({}, COIN_DETAILS);
            break;

        case 'ticker':
            formatData = Object.assign({}, COIN_TICKERS);
            break;

        case 'market_chart':
            formatData = Object.assign({}, COIN_MARKET_CHART);
            break;

        case 'market':
            formatData = Object.assign({}, COIN_MARKETS);
            break;

        case 'coin_list':
            formatData = Object.assign({}, COIN_LIST);
            break;

        default :
            return false;
    }
    // looping response and reformat

    Object.keys(formatData).forEach(index => {
        formatData[index] = clearEmpties(source[index])
    })

    // testTransformData(source, formatData)
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
                            element[key] = null
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


const clean = (object) => {
    Object
        .entries(object)
        .forEach(([k, v]) => {
            if(k === null || k === '') delete object[k]
            if (Number.isInteger(v)) {
                object[k] = + Math.floor(object[k]).toFixed(6);
            }

            if (Math.log10(v) > 19) {
                // o[k] =  Math.floor(o[k]) + 0.0000001;
                delete object[k];
            }

            if (v === "?" || v === '-') object[k] = null;

            if (
                v === '' ||
                v === null ||
                v === undefined ||
                v.length === 0
            ) {
                if (Array.isArray(object))
                    object.splice(k);
            }

            if (v && typeof v === 'object') {
                clean(v);
            }
        });
    return object;
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


module.exports = { formatDataFunc , testFormatCoinData, clean }