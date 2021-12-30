var CGKCoin = require('./controllers/coin.controller');


//CGKCoin.getCoinMarket();
//CGKCoin.syncCoinList();

//CGKCoin.fetchCoinDetails('bitcoin', {}, true)
//CGKCoin.syncCoinDetails();

/* Test purpose */
//CGKCoin.testFetchCoinDetails();
CGKCoin.getCoinTickers('bitcoin', {}, true)
