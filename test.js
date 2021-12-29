var CGKCoin = require('./controllers/coin.controller');
//CGKCoin.getCoinMarket();
//CGKCoin.fetchCurrentCoinDetails('bitcoin')



CGKCoin.fetchCoinDetails('bitcoin', {}, true)
//CGKCoin.syncCoinList();


/* Test purpose */
//CGKCoin.testFetchCoinDetails();