'use strict'

var client = require('../config/elastic.config');
const fs = require('fs');

class ElasticService {
    constructor(){}
    // create index new
    elk_create_index(name) {
        client.indices.create({
            index: name
        }, function (err, resp, status) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(resp);
            }
        });
    }
    // delete index
    elk_delete_index  (name) {
        client.indices.delete({ index: name }, function (err, resp, status) {
            console.log("delete", resp)
            return true
        });
    }
    // add document in index
    elk_add_document (name, data, id= null) {
        client.index({
            index: name,
            id: id,
            body: data
        }, function (err, resp, status) {
            if (err) {
                console.log(err)
                return false
            }
        });
    }
    async elk_create_bulk(ind, dataset) {
        const body = dataset.flatMap(doc => [{ index: { _index: ind, _id: doc.id } }, doc]);
        const { body: bulkResponse } = await client.bulk({ refresh: true, body });
    }
    // delete doc
    elk_delete_doc(name, list_doc) {
        client.delete({ index: name, id: list_doc }, function (err, resp) {});
    }

    date_time(currentdate){
        let month = currentdate.getMonth()>9?currentdate.getMonth()+1:'0'+(currentdate.getMonth()+1)
        let day = currentdate.getDate()>9?currentdate.getDate():'0'+currentdate.getDate()
        return currentdate.getFullYear()+"-"+ month + "-" + day
    }

    ReplaceStr(str,se,re){
        return str.split(se).join(re)
    }
}
const elasticService = new ElasticService()
module.exports = elasticService;