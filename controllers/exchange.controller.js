// init state
const CoinGecko = require('coingecko-api')
const CoinGeckoClient = new CoinGecko()
// for read & write file
const fs = require('fs')
// implement elasticsearch
const elasticService = require("../services/elastic.service")
const { formatDataFunc, testFormatCoinData } = require("../utils/utils")


class CGKExchangeController {
	constructor() {
		this.exchange_list = fs.existsSync('data/exchange_list.json') ? fs.readFileSync('data/exchange_list.json') : '[]';
		this.exchange_list_index = "cgk_exchange_list"
		this.exchange_index = "cgk_exchange"
	}
	
	async ping() {
		let data = await CoinGeckoClient.ping();
		console.log(data);
	};
	
	async fetchListExchange () {
		try {
			const data = await CoinGeckoClient.exchanges.list();
			fs.writeFileSync('data/exchange_list.json', JSON.stringify(data.data))
			console.log('total coin are ' + data.data.length + ' elements.')
			
		} catch (e) {
			console.log(e)
			return false
		}
		return true
	}
	
	async syncListExchange() {
		try {
			await this.fetchListExchange();
			// map data and insert to db
			console.log("Syncing data to elastic")
			let insert_data = JSON.parse(this.exchange_list.toString())
			insert_data = insert_data.filter(item => {
				return formatDataFunc('coin_list', item)
			});
			//console.log(insert_data);
			await elasticService.create_bulk(this.exchange_list_index, insert_data)
			//elasticService.check_health();
		} catch (e) {
			console.log(e)
			return false
			//write log here
		}
		return true
	}
	
	// get data and store it to json file
	async fetchAllExchange(per_page, page) {
		try {
			const params = {
				per_page,
				page
			}
			const data = await CoinGeckoClient.exchanges.all(params);
			console.log(data.data, data.data.length)
			
		} catch (e) {
			console.log(e)
			return false
		}
		return true
	}
	
	// sync data to elastic
	async syncAllExchange() {
		try {
			// map data and insert to db
			console.log("Syncing data to elastic")
			let insert_data = JSON.parse(this.coin_list.toString())
			
			
			
			if (insert_data.length) await elasticService.create_bulk(this.coin_list_index, insert_data)
			//elasticService.check_health();
		} catch (e) {
			console.log(e)
			return false
			//write log here
		}
		return true
	}
	
}

let CGKExchange = new CGKExchangeController();

module.exports = CGKExchange;

