let CGKCoin = require('./controllers/coin.controller');
let CGKExchange = require('./controllers/exchange.controller');
let CGKDerivative = require('./controllers/derivatives.controller');

//CGKCoin.fetchCoinList();
//CGKCoin.syncCoinList();

//CGKCoin.syncCoinMarket(250, true);
//CGKCoin.syncCoinList();

//CGKCoin.fetchCoinDetails('bitcoin', {}, true)
//CGKCoin.syncCoinDetails();
//CGKCoin.syncBatchCoinDetails();
//CGKCoin.testSyncCoinDetails();


/* Test purpose */
//CGKCoin.testFetchCoinDetails(true);
//CGKCoin.testFetchCoinDetails();
//CGKCoin.syncCoinDetails();
//CGKCoin.getCoinTickers('bitcoin', {}, true)


// ========= Exchange ==========
//CGKExchange.fetchAllExchange(250, 1)
//CGKExchange.fetchListExchange();
//CGKExchange.syncListExchange();
//CGKExchange.syncAllExchange();
//CGKExchange.syncExchangeDetails();
//CGKExchange.syncBatchExchangeDetails(50);
//CGKExchange.testSyncExchangeDetails('binance')
// CGKExchange.syncExchangeRates();
//CGKExchange.fetchExchangeTicker('binance')
CGKExchange.syncExchangeAllTickers()

// ========== Derivative ==========
//CGKDerivative.syncDerivativeTickers();
//CGKDerivative.fetchDerivativeExchangesList();
//CGKDerivative.fetchDerivativeExchangeData('bitmex')
//CGKDerivative.fetchDerivativeAllExchange();
//CGKDerivative.syncDerivativeAllExchange()