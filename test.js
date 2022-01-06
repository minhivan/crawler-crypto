var CGKCoin = require('./controllers/coin.controller');
var CGKExchange = require('./controllers/exchange.controller');

//CGKCoin.fetchCoinList();
//CGKCoin.syncCoinList();

//CGKCoin.syncCoinMarket(250, true);
//CGKCoin.syncCoinList();

//CGKCoin.fetchCoinDetails('bitcoin', {}, true)
//CGKCoin.syncCoinDetails();

/* Test purpose */
//CGKCoin.testFetchCoinDetails(true);

//CGKCoin.syncCoinDetails();
//CGKCoin.getCoinTickers('bitcoin', {}, true)


// ========= Exchange ==========
//CGKExchange.fetchAllExchange(250, 1)
//CGKExchange.fetchListExchange();
CGKExchange.syncListExchange();