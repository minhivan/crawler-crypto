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
		this.exchange_list_index = "cgk_exchange_list"
		this.exchange_index = "cgk_exchange"
		this.exchange_detail_index = "cgk_exchange_details"
	}
	
	async ping() {
		let data = await CoinGeckoClient.ping();
		console.log(data);
	};
	
	async fetchListExchange () {
		try {
			const data = await CoinGeckoClient.exchanges.list();
			fs.writeFileSync('data/exchange/exchange_list.json', JSON.stringify(data.data))
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

	
	async syncBatchExchangeDetails(batch_query) {
		try {
			let exchange_list = JSON.parse(this.exchange_list.toString());
			//exchange_list = exchange_list.slice(220);
			let arr = [];
			let batch_query = 50;
			for (const value in exchange_list) {
				const id = exchange_list[value].id
				console.log("Syncing " + id);
				// starting sync
				let response = await this.fetchExchangeDetail(id); // true
				arr.push(response)

				if(arr.length === batch_query || value === exchange_list.length - 1) {
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

	
	async testSyncExchangeDetails (id) {
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
}

let CGKExchange = new CGKExchangeController();

module.exports = CGKExchange;

