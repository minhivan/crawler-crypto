// init state
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
// for read & write file
const fs = require('fs');
// implement elasticsearch
const elasticService = require("../services/elastic.service");



class CGKCoinController  {
    constructor() {
        this.coin_list = JSON.parse(fs.readFileSync('data/coin_list.json'));
        //this.coin_details = JSON.parse(fs.readFileSync('data/coin_details.json'));
    }

    async ping()
    {
        let data = await CoinGeckoClient.ping();
        console.log(data);
    };

    // CGK Coin
    // write data to file json
    async fetchCoinList()
    {
        try {
            const data = await CoinGeckoClient.coins.list();
            if (data) {
                fs.writeFileSync('data/coin_list.json', JSON.stringify(data.data));
                console.log('total coin are ' + coin_list.length + ' elements.');
                
            }
            // return CoinGeckoClient.coins.list();
        } catch (error) {
            console.log(error);
        }
    };

    async syncCoinList() 
    {
        try {
            // map data and insert to db

            console.log("Syning data to elastic");
            let insert_data = this.coin_list.map(coin => {

            })

            elasticService.elk_create_bulk('coin_list')
        } catch (error) {
            console.log(error);
        }
    }


   async getCoinMarket()
    {
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


