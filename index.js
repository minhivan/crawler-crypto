let CGKCoin = require('./controllers/coin.controller');
let CGKExchange = require('./controllers/exchange.controller')
let CGKDerivative = require('./controllers/derivatives.controller')


process.argv.forEach(function (val, index, array) {

});




// init fetch all data list & create files
const init = async () => {
    // fetch coin list
    await CGKCoin.fetchCoinList();

    // fetch exchange list
    await CGKExchange.fetchListExchange();

    // fetch derivatives list
    await CGKDerivative.fetchDerivativeExchangesList()
    
}

init();

// CGKExchange.syncExchangeDetails();
// CGKCoin.syncBatchCoinDetails();
// init();


//CGKCoin.fetchCoinDetails('bitcoin', {}, true)

//CGKCoin.getCoinMarket();

