let CGKCoin = require('./controllers/coin.controller');
let CGKExchange = require('./controllers/exchange.controller');
let CGKDerivative = require('./controllers/derivatives.controller');


console.time("Time my API call");
(async function () {
    //CGKCoin.fetchCoinList();
    //CGKCoin.syncCoinList();
    
    //await CGKCoin.syncCoinMarket(50);
    //CGKCoin.syncCoinList();
    // await CGKCoin.getCoinMarketChart();
    //await CGKCoin.syncCoinTickers()
    //await CGKCoin.testSyncCoinTickers()
    await CGKCoin.syncCoinMarketChart()
    //CGKCoin.fetchCoinDetails('bitcoin', {}, true)
    //CGKCoin.syncCoinDetails();
    //await CGKCoin.syncBatchCoinDetails();
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
    //await CGKExchange.syncExchangeAllTickers()
    
    // ========== Derivative ==========
    //CGKDerivative.syncDerivativeTickers();
    //CGKDerivative.fetchDerivativeExchangesList();
    //CGKDerivative.fetchDerivativeExchangeData('bitmex')
    //CGKDerivative.fetchDerivativeAllExchange();
    //CGKDerivative.syncDerivativeAllExchange()
    
})()

console.timeEnd("Time my API call");
