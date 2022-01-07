// init state
const CoinGecko = require('coingecko-api')
const CoinGeckoClient = new CoinGecko()
// for read & write file
const fs = require('fs')
// implement elasticsearch
const elasticService = require("../services/elastic.service")
const { formatDataFunc, testFormatCoinData } = require("../utils/utils")


class CGKCoinController {
    constructor() {
        this.coin_list = fs.existsSync('data/coin_list.json') ? fs.readFileSync('data/coin_list.json') : '[]';
        this.coin_details = fs.readFileSync('data/coin_details.json');
        this.coin_markets = fs.existsSync('data/coin_markets.json') ? fs.readFileSync('data/coin_details.json') : '[]';
        this.json_test_data = fs.existsSync('data/response.json') ? fs.readFileSync('data/response.json') : '[]'
        this.coin_details_index = "cgk_coin_details"
        this.coin_markets_index = "cgk_coin_markets"
        this.coin_list_index = "cgk_coin_list"
        this.coin_tickers_index = "cgk_coin_tickers"
    }

    async ping() {
        let data = await CoinGeckoClient.ping();
        console.log(data);
    };

    // CGK Coin

    // get data and store it to json file
    async fetchCoinList() {
        try {
            const data = await CoinGeckoClient.coins.list()
            if (data.data.length) {
                fs.writeFileSync('data/coin_list.json', JSON.stringify(data.data))
                console.log('total coin are ' + data.data.length + ' elements.')
            }

        } catch (e) {
            console.log(e)
            return false
        }
        return true
    }


    // sync data to elastic
    async syncCoinList() {
        try {
            // map data and insert to db
            console.log("Syncing data to elastic")
            let insert_data = JSON.parse(this.coin_list.toString())
            insert_data = insert_data.filter(item => {
                return formatDataFunc('coin_list', item)
            });
            //console.log(insert_data);
            if (insert_data.length) await elasticService.create_bulk(this.coin_list_index, insert_data)
            //elasticService.check_health();
        } catch (e) {
            console.log(e)
            return false
            //write log here
        }
        return true
    }

    // fetch coin market with page
    async fetchCoinMarket(per_page= 250, page, sync = false) {
        let currency = 'usd',
            obj = {
                per_page,
                vs_currency: currency,
                page,
                sparkline: true,
                price_change_percentage: ["1h,24h,7d,14d,30d,200d,1y"]
            }

        try {
            await new Promise(resolve => setTimeout(resolve, 5/6*1000))
            let response = await CoinGeckoClient.coins.markets(obj)
            let insert_data = response.data
            insert_data = insert_data.filter(item => {
                return formatDataFunc('market', item)
            });

            if (sync) await elasticService.create_bulk(this.coin_markets_index, insert_data)

        } catch (e) {
            console.log(e)
            return false
        }
        return true;

    }

    // sync coin market data to elastic
    async syncCoinMarket(per_page, sync = false) {
        try {
            let total_coin = JSON.parse(this.coin_list.toString()).length
            let total_page = Math.round(total_coin / per_page )

            let x = 1;
            while (x <= total_page) {
                console.log("Syncing page " + x)
                await this.fetchCoinMarket(per_page, x, sync)
                x++
            }
        } catch (e) {
            console.log(e)
            return false
        }
        return true
    }

    // test fetch coin market
    async testCoinMarket () {
        try {
            const data = JSON.parse(this.coin_markets.toString()).shift()
            let formattedData = formatDataFunc('detail', data)


        } catch (e) {
            console.log(e)
            return false
        }
        return true
    }


    // push data to elasticsearch
    async fetchCoinDetails(id, params = {}) {
        try {
            let response = {};
            params.tickers = true;
            //await new Promise(resolve => setTimeout(resolve, 5/6*1000));
            response = await CoinGeckoClient.coins.fetch(id, params);
            //console.log(formattedData)
            return await formatDataFunc('detail', response.data);
            //return response.data
            //if (sync) await elasticService.add_document(this.coin_details_index, formattedData.id, formattedData)

        } catch (error) {
            console.log(error)
            return false;
        }
    }


    // test function
    async testFetchCoinDetails (sync = false) {
        try {
            const data = JSON.parse(this.json_test_data.toString()).shift(); // return object
            let formattedData = formatDataFunc('detail', data)
            //console.log(formattedData)
            //if (sync) await elasticService.add_document(this.coin_details_index, formattedData.id, formattedData)
        } catch (e) {
            console.log(e)
            return false
        }
        return true
    }

    async syncCoinDetails(sync = true) {
        let arr = [];

        try {
            let coin_list = JSON.parse(this.coin_list.toString());
            let items = coin_list.slice(1, 3);
            for (let value in items) {
                var id = items[value].id
                // starting sync
                let response = await this.fetchCoinDetails(id); // true
                console.log(response)
                // arr.push(response);
                // response.length = 0
                arr[id] = response
            }
            // fs.writeFileSync('data/coin_details.json', JSON.stringify(temp))
            console.log(arr)
        } catch (e) {
            console.log(e);
            return false
        }

        return true;
    }
    
    async testSyncCoinDetails () {
        try {
            let coin_details = JSON.parse(this.coin_details.toString());
            await elasticService.create_bulk(this.coin_details_index, coin_details)
        } catch (e) {
            console.log(e)
            return false;
        }
    }
    
    
    async importCoinDetails () {
        try {
            let coin_list = JSON.parse(this.coin_list.toString());
            let items = coin_list.slice(0, 100);
            let currentDataSet = JSON.parse(this.coin_details.toString());
            console.log("starting");
            for (const value of items) {
                const i = items.indexOf(value);
                console.log('%d: %s', i, value);
                let id = value.id;
                let response =  await CoinGeckoClient.coins.fetch(id, params);
                //console.log(response.code);
                let data = response.data;
                // starting import
                // find index and insert all new documents
                let checking = currentDataSet.find(item => item.id == data.id);
                if (checking) {
                    currentDataSet[data.id] = data;
                } else {
                    currentDataSet.push(data);
                }
    
                //console.log("Save data to coin details");
    
            }
            console.log(currentDataSet.length);
            fs.writeFileSync('data/coin_details.json', JSON.stringify(currentDataSet));
        } catch (e) {
            console.log(e)
            return false;
        }
        return true;
    }


    async getCoinTickers(id, params = {}, sync = false) {
        try {
            const response = await CoinGeckoClient.coins.fetchTickers(id, params);
            let data = response.data;
            //console.log(data)
            let formattedData = formatDataFunc('ticker', data);
            // add index to formatted data
            formattedData.id = id;
            if (sync) await elasticService.add_document(this.coin_tickers_index, id, formattedData)
        } catch (e) {
            console.log(e)
            return false
        }
        return true
    }

    async getHistoricalData(id, params = {}) {

        return CoinGeckoClient.coins.fetchTickers(id);
    }

    async getCoinMarketChart(id, params = {}) {

        return CoinGeckoClient.coins.fetchMarketChart('bitcoin', params);
    }

}

let CGKCoin = new CGKCoinController();

module.exports = CGKCoin;

