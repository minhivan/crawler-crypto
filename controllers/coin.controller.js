// init state
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
// for read & write file
const fs = require('fs');
// implement elasticsearch
const elasticService = require("../services/elastic.service");



class CGKCoinController  {
    constructor() {
        this.coin_list = fs.readFileSync('data/coin_list.json');
        this.coin_details = fs.readFileSync('data/coin_details.json');
    }

    async ping()
    {
        let data = await CoinGeckoClient.ping();
        console.log(data);
    };

    // CGK Coin

    // get data and store it to json file
    async fetchCoinList()
    {
        try {
            const data = await CoinGeckoClient.coins.list();
            if(data.data.length) {
                fs.writeFileSync('data/coin_list.json', JSON.stringify(data.data));
                console.log('total coin are ' + data.data.length + ' elements.');
            }

        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }


    // sync data to file json
    async syncCoinList()
    {
        try {
            // map data and insert to db
            console.log("Syncing data to elastic");
            let insert_data = JSON.parse(this.coin_list.toString());
            insert_data = insert_data.filter(index => index);
            //console.log(insert_data);
            if(insert_data.length) await elasticService.create_bulk('cgk_coin_list', insert_data);
            //elasticService.check_health();
        } catch (e) {
            console.log(e);
            return false;
            //write log here
        }
        return true;
    }


   async getCoinMarket(currency = 'usd', per_page = 250)
    {
        let total_coin = JSON.parse(this.coin_list.toString()).length;
        let obj = {
            per_page,
            vs_currency: currency,
            page: 1
        }

        try {
            let response = await CoinGeckoClient.coins.markets(obj);
            let insert_data = response.data;
            insert_data = insert_data.filter(item => item);
            console.log("Syncing cgk_coin_market to elastic");
            //console.log(insert_data);
            if(insert_data.length) await elasticService.create_bulk('cgk_coin_market', insert_data);

        } catch (e) {
            console.log(e)
            return false
        }
        return CoinGeckoClient.coins.markets();
    }


    async getCurrentCoinData(id, params = {})
    {
        return CoinGeckoClient.coins.fetch(id, params);
    }

    async getCoinTickers(id, params={})
    {
        return CoinGeckoClient.coins.fetchTickers(id, params);
    }

    async getHistoricalData(id, params={})
    {
        return CoinGeckoClient.coins.fetchTickers(id);
    }

    async getCoinMarketChart(id, params={})
    {
        return CoinGeckoClient.coins.fetchMarketChart('bitcoin', params);
    }




    //contract

    // categories

    // exchanges

    //derivatives


}

let CGKCoin = new CGKCoinController();

module.exports = CGKCoin;

// detail coin


// market data


