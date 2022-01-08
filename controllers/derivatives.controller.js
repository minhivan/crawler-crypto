// init state
const CoinGecko = require('coingecko-api')
const CoinGeckoClient = new CoinGecko()
// for read & write file
const fs = require('fs')
// implement elasticsearch
const elasticService = require("../services/elastic.service")
const { formatDataFunc, clean } = require("../utils/utils")


class CGKDerivativeController {
	constructor() {
		this.derivative_tickers = fs.existsSync('data/derivative/derivative_tickers.json') ? fs.readFileSync('data/derivative/derivative_tickers.json') : '[]';
		this.derivative_tickers_index = "cgk_derivative_tickers"
		this.derivative_exchanges_index = "cgk_derivative_exchanges"
		// this.exchange_detail_index = "cgk_exchange_detail"
	}
	
	async ping() {
		let data = await CoinGeckoClient.ping();
		console.log(data);
	};


	// // get data and store it to json file
	async fetchDerivativeTickers() {
		try {
			const data = await CoinGeckoClient.derivatives.fetchTickers()
			if (data.data.length) {
				fs.writeFileSync('data/derivative/derivative_tickers.json', JSON.stringify(data.data))
				console.log('total coin are ' + data.data.length + ' elements.')
			}

		} catch (e) {
			console.log(e)
			return false
		}
		return true
	}

	// sync data to elastic
	async syncDerivativeTickers() {
		try {
			await this.fetchDerivativeTickers;
			// map data and insert to db
			console.log("Syncing data to elastic")
			let insert_data = JSON.parse(this.derivative_tickers.toString())
			insert_data = insert_data.filter(item => clean(item));
			//console.log(insert_data);
			if (insert_data.length) await elasticService.create_bulk(this.derivative_tickers_index, insert_data)
			//elasticService.check_health();
		} catch (e) {
			console.log(e)
			return false
			//write log here
		}
		return true
	}

	// get derivative exchanges
	async fetchDerivativeExchanges() {

	}


	
}

let CGKDerivative = new CGKDerivativeController();

module.exports = CGKDerivative;

