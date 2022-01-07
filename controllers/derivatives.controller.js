// init state
const CoinGecko = require('coingecko-api')
const CoinGeckoClient = new CoinGecko()
// for read & write file
const fs = require('fs')
// implement elasticsearch
const elasticService = require("../services/elastic.service")
const { formatDataFunc, testFormatCoinData } = require("../utils/utils")


class CGKDerivativeController {
	constructor() {
	
	}
	
	async ping() {
		let data = await CoinGeckoClient.ping();
		console.log(data);
	};
	
	// // get data and store it to json file
	// async fetchCoinList() {
	// 	try {
	// 		const data = await CoinGeckoClient.coins.list()
	// 		if (data.data.length) {
	// 			fs.writeFileSync('data/coin_list.json', JSON.stringify(data.data))
	// 			console.log('total coin are ' + data.data.length + ' elements.')
	// 		}
	//
	// 	} catch (e) {
	// 		console.log(e)
	// 		return false
	// 	}
	// 	return true
	// }
	//
	// // sync data to elastic
	// async syncCoinList() {
	// 	try {
	// 		// map data and insert to db
	// 		console.log("Syncing data to elastic")
	// 		let insert_data = JSON.parse(this.coin_list.toString())
	// 		insert_data = insert_data.filter(item => {
	// 			return formatDataFunc('coin_list', item)
	// 		});
	// 		//console.log(insert_data);
	// 		if (insert_data.length) await elasticService.create_bulk(this.coin_list_index, insert_data)
	// 		//elasticService.check_health();
	// 	} catch (e) {
	// 		console.log(e)
	// 		return false
	// 		//write log here
	// 	}
	// 	return true
	// }
	
}

let CGKDerivative = new CGKDerivativeController();

module.exports = CGKDerivative;

