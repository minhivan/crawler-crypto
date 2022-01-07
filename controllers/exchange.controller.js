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
	async fetchAllExchange(params, sync = false) {
		try {
			const response = await CoinGeckoClient.exchanges.all(params)
			let data = response.data
			data.forEach(element => {
				formatDataFunc('exchange', element)
			})

			if (sync) await elasticService.create_bulk(this.exchange_index, data)
		} catch (e) {
			console.log(e)
			return false
		}
		return true
	}
	
	// sync data to elastic
	async syncAllExchange() {
		try {
			let params = {
				per_page: 250,
				page: 1
			}
			// map data and insert to db
			let total_exchange = JSON.parse(this.exchange_list.toString()).length
			let total_page = Math.round(total_exchange / params.per_page )

			for(var i = 1; i <= total_page; i ++ ) {
				console.log("call api")
				params.page = i;
				console.log(params)
				await this.fetchAllExchange(params, true)
			}

			//await this.fetchAllExchange(params, true)

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

