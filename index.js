let CGKCoin = require('./controllers/coin.controller');
let CGKExchange = require('./controllers/exchange.controller')
let CGKDerivative = require('./controllers/derivatives.controller')


process.argv.forEach(function (val, index, array) {

});




// init fetch all data list & create files
const init = async () => {
    // fetch coin list
    await CGKCoin.syncCoinList();

    // fetch exchange list
    await CGKExchange.syncListExchange();

    // fetch derivatives list
    await CGKDerivative.syncDerivativeAllExchange()
    
}

// CGKExchange.syncExchangeDetails();
CGKCoin.syncBatchCoinDetails();
// init();


//CGKCoin.fetchCoinDetails('bitcoin', {}, true)

//CGKCoin.getCoinMarket();

