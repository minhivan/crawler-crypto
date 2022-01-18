let CGKCoin = require('./controllers/coin.controller');
let CGKExchange = require('./controllers/exchange.controller')
let CGKDerivative = require('./controllers/derivatives.controller')

// init fetch all data list & create files
const init = async () => {
    // fetch coin list
    await CGKCoin.fetchCoinList();
    // fetch exchange list
    // await CGKExchange.syncListExchange();
}


// Using process env to create crawler with index
(async function () {
    for await (let val of process.argv) {
        switch (val) {
            case "sync_coin_detail": // Loop coin list
                await CGKCoin.syncBatchCoinDetails(25);
                await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 15)) // wait for another function setup
                break;

            case "sync_coin_market":
                await CGKCoin.syncCoinMarket(50);
                await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 15)) // wait for another function setup
                break;

            case "sync_coin_ticker": // Loop coin list
                await CGKCoin.syncCoinTickers();
                await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 15)) // wait for another function setup
                break;

            case "sync_coin_market_chart":
                await CGKCoin.syncCoinMarketChart(10);
                await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 15)) // wait for another function setup
                break;

            case "sync_exchange_detail":
                await CGKExchange.syncBatchExchangeDetails(50);
                await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 15)) // wait for another function setup
                break;

            case "sync_exchange_ticker": // Loop exchange list
                await CGKExchange.syncExchangeAllTickers();
                await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 15)) // wait for another function setup
                break;

            case "sync_exchange_rates":
                await CGKExchange.syncExchangeRates();
                await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 15)) // wait for another function setup
                break;

            case "sync_derivative_exchange":
                await CGKDerivative.syncDerivativeAllExchange();
                await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 15)) // wait for another function setup
                break;

            case "test":
                console.log("Test case 1");
                //await new Promise(resolve => setTimeout(resolve, 1000*10)) // wait for another function setup
                break;

            case "init":
                await init();
                break;
        }
    }
})()




