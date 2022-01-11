let CGKCoin = require('./controllers/coin.controller');
let CGKExchange = require('./controllers/exchange.controller')
let CGKDerivative = require('./controllers/derivatives.controller')

// init fetch all data list & create files
const init = async () => {
    // fetch coin list
    await CGKCoin.syncCoinList();

    // fetch exchange list
    //await CGKExchange.syncListExchange();

    // fetch derivatives list
    //await CGKDerivative.fetchDerivativeExchangesList()

}


// process.argv.forEach(async function (val, index, array) {
//     switch (val) {
//         case "sync_coin_detail":
//             await CGKCoin.syncBatchCoinDetails(25);
//             break;
//
//         case "sync_coin_market":
//             await CGKCoin.syncCoinMarket(50);
//             await new Promise(resolve => setTimeout(resolve, 1000*3)) // wait for another function setup
//             break;
//
//         case "sync_exchange_detail":
//             await CGKExchange.syncBatchExchangeDetails(50);
//             await new Promise(resolve => setTimeout(resolve, 1000*3)) // wait for another function setup
//             break;
//
//         case "sync_derivative_detail":
//             await CGKDerivative.syncDerivativeAllExchange();
//             break;
//
//         case "sync_exchange_rates":
//             await CGKExchange.syncExchangeRates();
//             await new Promise(resolve => setTimeout(resolve, 1000*3)) // wait for another function setup
//
//             break;
//
//         case "test":
//             console.log("asdadasdad");
//             break;
//
//
//         case "init":
//             await init();
//     }
// });


(async function () {
    for await (let val of process.argv) {
        switch (val) {
            case "sync_coin_detail":
                await CGKCoin.syncBatchCoinDetails(25);
                break;

            case "sync_coin_market":
                await CGKCoin.syncCoinMarket(50);
                await new Promise(resolve => setTimeout(resolve, 1000*3)) // wait for another function setup
                break;

            case "sync_exchange_detail":
                await CGKExchange.syncBatchExchangeDetails(50);
                await new Promise(resolve => setTimeout(resolve, 1000*3)) // wait for another function setup
                break;

            case "sync_derivative_detail":
                await CGKDerivative.syncDerivativeAllExchange();
                break;

            case "sync_exchange_rates":
                await CGKExchange.syncExchangeRates();
                await new Promise(resolve => setTimeout(resolve, 1000*3)) // wait for another function setup
                break;

            case "test":
                console.log("Test case ");
                await new Promise(resolve => setTimeout(resolve, 1000*10)) // wait for another function setup
                break;

            case "init":
                await init();
                break;
        }
    }
})()


