// init state

const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();


class GetCKCData  {
    async ping() {
        let data = await CoinGeckoClient.ping();
        console.log(data);
    };

    async getListCoin() {
        let data = await CoinGeckoClient.coins.list();
        console.log(data);
    };

    async sendNotification() {
        try {
            let data = await CoinGeckoClient.coins.list();
            console.log(data);
        } catch (err) {
            console.log(err)
        }
    }
}

GetCKCData.sendNotification();

// detail coin


// market data


