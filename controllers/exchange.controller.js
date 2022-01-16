// init state
const CoinGecko = require('coingecko-api')
const CoinGeckoClient = new CoinGecko()
// for read & write file
const fs = require('fs')
// implement elasticsearch
const elasticService = require("../services/elastic.service")
const { formatDataFunc, testFormatCoinData, clean} = require("../utils/utils")


class CGKExchangeController {
	constructor() {
		this.exchange_list = fs.existsSync('data/exchange/exchange_list.json') ? fs.readFileSync('data/exchange/exchange_list.json') : '[]';
		this.exchange_rates = fs.existsSync('data/exchange/exchange_rates.json') ? fs.readFileSync('data/exchange/exchange_rates.json') : '[]';
		this.exchange_list_index = "cgk_exchange_list"
		this.exchange_index = "cgk_exchange"
		this.exchange_detail_index = "cgk_exchange_details"
		this.exchange_rates_index = "cgk_exchange_rates"
		this.exchange_tickers_index = "cgk_exchange_tickers"
	}
	
	async ping() {
		let data = await CoinGeckoClient.ping();
		console.log(data);
	};

	// Fetch list exchange
	async fetchListExchange () {
		try {
			const data = await CoinGeckoClient.exchanges.list();
			fs.writeFileSync('data/exchange/exchange_list.json', JSON.stringify(data.data))
			console.log('total exchange are ' + data.data.length + ' elements.')

		} catch (e) {
			console.log(e)
			return false
		}
		return true
	}

	// Sync list exchange
	async syncListExchange() {
		try {
			await this.fetchListExchange();
			// map data and insert to db
			let insert_data = JSON.parse(this.exchange_list.toString())
			insert_data = insert_data.filter(item => {
				return formatDataFunc('coin_list', item)
			});
			console.log("Syncing data to elastic")
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
	async fetchAllExchange(params) {
		try {
			const response = await CoinGeckoClient.exchanges.all(params)
			let data = response.data
			data = data.filter(element => clean(element));
			// data.forEach(element => {
			// 	// formatDataFunc('exchange', element)
			// 	clean(element)
			// })
			return data;
		} catch (e) {
			console.log(e)
			return false
		}
	}
	
	// sync data to elastic
	async syncAllExchange() {
		try {
			await this.syncListExchange();
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
				let data = await this.fetchAllExchange(params)
				await elasticService.create_bulk(this.exchange_index, data)
			}

			//await this.fetchAllExchange(params, true)

		} catch (e) {
			console.log(e)
			return false
			//write log here
		}
		return true
	}

	
	
	// Fetch exchange details
	async fetchExchangeDetail(id) {
		try {
			await new Promise(resolve => setTimeout(resolve, 5/6*1000));
			let response = await CoinGeckoClient.exchanges.fetch(id);
			// return formatDataFunc('detail', response.data);
			let data = clean(response.data)
			data.id = id
			return data
		} catch (error) {
			console.log(error)
			return false;
		}
	}

	// Sync batch exchange details
	async syncBatchExchangeDetails(batch_query = 50) {
		try {
			await this.fetchListExchange();
			let exchange_list = JSON.parse(this.exchange_list.toString());
			//exchange_list = exchange_list.slice(220);
			let arr = [];
			for (const value in exchange_list) {
				const id = exchange_list[value].id
				console.log("Syncing " + id);
				// starting sync
				let response = await this.fetchExchangeDetail(id); // true
				arr.push(response)

				if(arr.length === batch_query || value == exchange_list.length - 1) {
					console.log("Bulk array to elastic")
					await elasticService.create_bulk(this.exchange_detail_index, arr)
					arr.length = 0;
				}
			}
		} catch (e) {
			console.log(e);
			return false
		}
		
		return true;
	}
	
	// Sync exchange details
	async syncExchangeDetails() {
		try {
			let exchange_list = JSON.parse(this.exchange_list.toString());
			exchange_list = exchange_list.slice(220)

			for (const value in exchange_list) {
				const id = exchange_list[value].id
				console.log("Syncing " + id);
				// starting sync
				let response = await this.fetchExchangeDetail(id) // true
				await elasticService.add_document(this.exchange_detail_index, id, response)

			}
		} catch (e) {
			console.log(e);
			return false
		}

		return true;
	}

	// Test sync exchange details
	async testSyncExchangeDetails(id) {
		try {
			await new Promise(resolve => setTimeout(resolve, 5/6*1000));
			let response = await CoinGeckoClient.exchanges.fetch(id);
			// return formatDataFunc('detail', response.data);
			let data = clean(response.data)
			data.id = id
			await elasticService.add_document(this.exchange_detail_index, id, data)
		} catch (error) {
			console.log(error)
			return false;
		}
	}

	
	
	// Fetch exchange rates
	async fetchExchangeRates() {
		try {
			const data = await CoinGeckoClient.exchangeRates.all();
			fs.writeFileSync('data/exchange/exchange_rates.json', JSON.stringify(data.data.rates))
			// console.log('total exchange rate are ' + data.data.length + ' elements.')

		} catch (e) {
			console.log(e)
			return false
		}
		return true
	}

	// Sync exchange rates
	async syncExchangeRates() {
		try {
			// map data and insert to db
			await this.fetchExchangeRates()
			console.log("Syncing data to elastic")
			let insert_data = JSON.parse(this.exchange_rates.toString())
			let format_data = [];
			for (let [key, value] of Object.entries(insert_data)) {
				value.id = key;
				format_data.push(value);
			}

			await elasticService.create_bulk(this.exchange_rates_index, format_data)
		} catch (e) {
			console.log(e)
			return false
		}
	}

	
	
	// Fetch exchange tickers
	async fetchExchangeTicker(id, params = {}) {
		try {
			await new Promise(resolve => setTimeout(resolve, 5/6*1000));
			const response = await CoinGeckoClient.exchanges.fetchTickers(id, params)
			// console.log(JSON.stringify(response.data).length)
			return clean(response.data.tickers)
		} catch (e) {
			console.log(e)
			return false
		}
	}

	// Sync exchange all tickers
	async syncExchangeAllTickers( limit_page = 5) {
		try {
			await this.fetchListExchange()
			let exchange_list = JSON.parse(this.exchange_list.toString());
			//exchange_list = exchange_list.slice(20)
			for await (const value of exchange_list) {
				const id = value.id
				var data = [], i = 1;

				do {
					var import_data = []
					data = await this.fetchExchangeTicker(id, {page: i})
					console.log("Sync " + id + " page " + i)
					// console.log("Data length" ,data)
					if(data.length > 0) {
						data.map((item, index) => {
							item.idx = id + "." + item.coin_id + "." + (item.target_coin_id ?? "null")
							item.id = id
							item.rank = (index + (i-1) * 100) + 1;
							import_data.push(item);
						})
						console.log("Import length", import_data.length)

						await elasticService.create_bulk(this.exchange_tickers_index, import_data) // sync
					}
					data.length = 0;
					i++;
				} while (data.length >= 100 && i < limit_page)
			}

		} catch (e) {
			console.log(e)
			return false
		}

		return true
	}
	
}

let CGKExchange = new CGKExchangeController();

module.exports = CGKExchange;

