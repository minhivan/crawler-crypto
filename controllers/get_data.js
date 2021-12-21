// init state

const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();


class GetCKCData  {
    async ping()
    {
        let data = await CoinGeckoClient.ping();
        console.log(data);
    };

    // coin
    static async getListCoin()
    {
        let data = await CoinGeckoClient.coins.list();
        console.log(data);
    };

    static async getCoinMarket()
    {
        return CoinGeckoClient.coins.markets();
    }

    static async getCurrentCoinData(id, params = {})
    {
        return CoinGeckoClient.coins.fetch(id, params);
    }

    static async getCoinTickers(id, params={})
    {
        return CoinGeckoClient.coins.fetchTickers(id, params);
    }

    static async getHistoricalData(id, params={})
    {
        return CoinGeckoClient.coins.fetchTickers(id);
    }

    static async getCoinMarketChart(id, params={})
    {
        return CoinGeckoClient.coins.fetchMarketChart('bitcoin', params);
    }




    //contract

    // categories

    // exchanges

    //derivatives


}

GetCKCData.getCoinMarket().then(r => {
    console.log(r);
});

// detail coin


// market data


