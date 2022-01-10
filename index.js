let CGKCoin = require('./controllers/coin.controller');
let CGKExchange = require('./controllers/exchange.controller')
let CGKDerivative = require('./controllers/derivatives.controller')



// init fetch all data list & create files
const init = async () => {
    // fetch coin list
    await CGKCoin.fetchCoinList();

    // fetch exchange list
    await CGKExchange.fetchListExchange();

    // fetch derivatives list
    await CGKDerivative.fetchDerivativeExchangesList()

}


process.argv.forEach(async function (val, index, array) {
    switch (val) {
        case "sync_coin_detail":
            await CGKCoin.syncBatchCoinDetails();
            break;
        case "sync_exchange_detail":
            await CGKExchange.syncBatchExchangeDetails();
            break;
        case "sync_derivative_detail":
            await CGKDerivative.syncDerivativeAllExchange();
            break;
        case "init":
            await init();
    }
});


// CGKExchange.syncExchangeDetails();
// CGKCoin.syncBatchCoinDetails();
//CGKCoin.fetchCoinDetails('bitcoin', {}, true)
//CGKCoin.getCoinMarket();

