// init state
const CoinGecko = require('coingecko-api')
const CoinGeckoClient = new CoinGecko()
// for read & write file
const fs = require('fs')
// implement elasticsearch
const elasticService = require("../services/elastic.service")
const { formatDataFunc, cleanObject, clean} = require("../utils/utils")


class CGKCoinController {
    constructor() {
        this.coin_list = fs.existsSync('data/coin/coin_list.json') ? fs.readFileSync('data/coin/coin_list.json') : '[]';
        this.coin_details = fs.readFileSync('data/coin/coin_details.json');
        this.coin_markets = fs.existsSync('data/coin/coin_markets.json') ? fs.readFileSync('data/coin/coin_details.json') : '[]';
        this.json_test_response = fs.existsSync('data/response.json') ? fs.readFileSync('data/response.json') : '[]'
        this.coin_details_index = "cgk_coin_details"
        this.coin_markets_index = "cgk_coin_markets"
        this.coin_list_index = "cgk_coin_list"
        this.coin_tickers_index = "cgk_coin_tickers"
        this.test_data = fs.readFileSync('data/test.json');
        this.chart_days_ago = [1, 7, 30, 90, 180, 365];
    }
    
    async ping() {
        let data = await CoinGeckoClient.ping();
        console.log(data);
    };
    
    
    // get data and store it to json file
    async fetchCoinList() {
        try {
            const data = await CoinGeckoClient.coins.list()
            if (data.data.length) {
                fs.writeFileSync('data/coin/coin_list.json', JSON.stringify(data.data))
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
            await this.fetchCoinList()
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
        }
        return true
    }
    
    // fetch coin market with page
    async fetchCoinMarket(per_page= 250, page) {
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
            insert_data = insert_data.filter(item => clean(item));
            return insert_data;
            
        } catch (e) {
            console.log(e)
            return false
        }
        
    }
    
    // test fetch coin market
    async testCoinMarket () {
        try {
            const data = JSON.parse(this.coin_markets.toString()).shift()
            //let formattedData = formatDataFunc('detail', data)
            let dataClean = clean(data);
            console.log(dataClean)
        } catch (e) {
            console.log(e)
            return false
        }
        return true
    }
    
    
    // sync coin market data to elastic
    async syncCoinMarket(per_page) {
        try {
            let total_coin = JSON.parse(this.coin_list.toString()).length
            let total_page = Math.round(total_coin / per_page )
            // console.log(total_page)
            let x = 1;
            for(x; x <= total_page; x++) {
                console.log("Syncing page " + x)
                let data = await this.fetchCoinMarket(per_page, x)
                // data.map((element, index) => {
                //     element.rank = (x - 1) * per_page + index + 1;
                // })
                if(data.length) await elasticService.create_bulk(this.coin_markets_index, data)
            }
            
        } catch (e) {
            console.log(e)
            return false
        }
        return true
    }
    
    
    // push data to elasticsearch
    async fetchCoinDetails(id, params = {}) {
        try {
            params.tickers = true;
            await new Promise(resolve => setTimeout(resolve, 5/6*1000));
            let response = await CoinGeckoClient.coins.fetch(id, params);
            // return formatDataFunc('detail', response.data);
            return clean(response.data)
        } catch (error) {
            console.log(error)
            return false;
        }
    }
    
    // test function
    async testFetchCoinDetails (sync = false) {
        try {
            const data = JSON.parse(this.coin_details.toString()).shift(); // return object
            //let formattedData = formatDataFunc('detail', data)
            //let response = await this.fetchCoinDetails('ysl-io');
            //console.log(formattedData)
            let cleanData = clean(data['market_data'])
            console.log(cleanData)
            //fs.writeFileSync('data/coin_details.json', JSON.stringify(cleanData))
            //if (sync) await elasticService.add_document(this.coin_details_index, formattedData.id, formattedData)
        } catch (e) {
            console.log(e)
            return false
        }
        return true
    }
    
    // sync coin details
    async syncCoinDetails() {
        try {
            let coin_list = JSON.parse(this.coin_list.toString());
            coin_list = coin_list.slice(4899);
            for (const value in coin_list) {
                const id = coin_list[value].id
                console.log("Syncing " + id);
                // starting sync
                let response = await this.fetchCoinDetails(id); // true
                await elasticService.add_document(this.coin_details_index, id, response);
            }
            // fs.writeFileSync('data/coin_details.json', JSON.stringify(temp))
        } catch (e) {
            console.log(e);
            return false
        }
        return true;
    }
    
    // sync batch coin details
    async syncBatchCoinDetails (batch_query = 50, split = 3) {
        try {
            await this.fetchCoinList(); //Sync all coin list
            let coin_list = JSON.parse(this.coin_list.toString());
            //coin_list = coin_list.slice(12284);
            let arr = [];
            for (const value in coin_list) {
                const id = coin_list[value].id
                console.log("Syncing " + id);
                // starting sync
                let response = await this.fetchCoinDetails(id); // true
                arr.push(response)
                if(arr.length === batch_query || value == (coin_list.length - 1)) {
                    console.log("Bulk array to elastic")
                    await elasticService.create_bulk(this.coin_details_index, arr)
                    arr.length = 0;
                }
            }
            // fs.writeFileSync('data/coin_details.json', JSON.stringify(temp))
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
    
    
    // async importCoinDetails () {
    //     try {
    //         let coin_list = JSON.parse(this.coin_list.toString());
    //         let items = coin_list.slice(0, 100);
    //         let currentDataSet = JSON.parse(this.coin_details.toString());
    //         console.log("starting");
    //         for (const value of items) {
    //             const i = items.indexOf(value);
    //             console.log('%d: %s', i, value);
    //             let id = value.id;
    //             let response =  await CoinGeckoClient.coins.fetch(id, params);
    //             //console.log(response.code);
    //             let data = response.data;
    //             // starting import
    //             // find index and insert all new documents
    //             let checking = currentDataSet.find(item => item.id == data.id);
    //             if (checking) {
    //                 currentDataSet[data.id] = data;
    //             } else {
    //                 currentDataSet.push(data);
    //             }
    //             //console.log("Save data to coin details");
    //         }
    //         console.log(currentDataSet.length);
    //         fs.writeFileSync('data/coin/coin_details.json', JSON.stringify(currentDataSet));
    //     } catch (e) {
    //         console.log(e)
    //         return false;
    //     }
    //     return true;
    // }
    
    
    
    async fetchCoinTickers(id, params = {}) {
        try {
            const response = await CoinGeckoClient.coins.fetchTickers(id, params);
            //console.log(data)
            return clean(response.data.tickers)
        } catch (e) {
            console.log(e)
            return false
        }
    }
    
    
    async syncCoinTickers(max_page = 5) {
        try {
            let coin_list = JSON.parse(this.coin_list.toString());
            // coin_list = coin_list.slice(0,20);
            for await (const value of coin_list) {
                const id = value.id
                var data = [], i = 1;
                do {
                    var import_data = []
                    data = await this.fetchCoinTickers(id, {page: i})
                    console.log("Sync coin " + id + " page " + i)
                    // console.log("Data length" ,data)
                    //console.log(data)
                    if(data.length > 0) {
                        data.map((item, index) => {
                            item.idx    = item?.market?.identifier + (item?.coin_id ? "." + item.coin_id : "") + (item?.target_coin_id ? ("." + item?.target_coin_id) : "")
                            item.rank   = (index + (i-1) * 100) + 1; // paginate to 100
                            import_data.push(item);
                        })
                        //console.log("Import length", import_data.length)
                        
                        await elasticService.create_bulk(this.coin_tickers_index, import_data) // sync
                    }
                    //console.log(import_data)
                    data.length = 0;
                    i++;
                } while (data.length >= 100 && i < max_page)
            }
            
        } catch (e) {
            console.log(e)
            return false
        }
        
        return true
    }
    
    
    async getHistoricalData(id, params = {}) {
        
        return CoinGeckoClient.coins.fetchTickers(id);
    }
    
    
    
    async getCoinMarketChart(id, params ) {
        try {
            const response = await CoinGeckoClient.coins.fetchMarketChart(id, params);
            //console.log(data)
            return clean(response.data)
        } catch (e) {
            console.log(e)
            return false
        }
    }
    
    async syncCoinMarketChart(batch_query = 50) {
        let params = {
            vs_currency: 'usd',
            days: 1,
        }
        
        let data = await this.getCoinMarketChart('bitcoin', params);
        
        console.log(data)
        // for (var i of this.chart_days_ago) {
        //     console.log(i)
        // }
    }
    
}

let CGKCoin = new CGKCoinController();

module.exports = CGKCoin;
