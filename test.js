let CGKCoin = require('./controllers/coin.controller');
let CGKExchange = require('./controllers/exchange.controller');
let CGKDerivative = require('./controllers/derivatives.controller');

//CGKCoin.fetchCoinList();
//CGKCoin.syncCoinList();

//CGKCoin.syncCoinMarket(250, true);
//CGKCoin.syncCoinList();

//CGKCoin.fetchCoinDetails('bitcoin', {}, true)
//CGKCoin.syncCoinDetails();
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
// CGKExchange.syncAllExchange();

//CGKExchange.fetchExchangeDetail('binance')


// ========== Derivative ==========
CGKDerivative.syncDerivativeTickers();