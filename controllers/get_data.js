// init state
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
// for read & write file
const fs = require('fs');
const coin_list = JSON.parse(fs.readFileSync('data/coin_list.json'));

// implement elasticsearch



class GetCKCData  {
    async ping()
    {
        let data = await CoinGeckoClient.ping();
        console.log(data);
    };

    // coin
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

    async insertNewCoin() 
    {
        try {
            
        } catch (error) {
            
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

const crawCKCData = new GetCKCData();

module.exports = crawCKCData;

// detail coin


// market data


