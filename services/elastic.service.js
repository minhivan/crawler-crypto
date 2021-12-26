'use strict'

let client = require('../config/elastic.config');
const fs = require('fs');

class ElasticService {
    constructor(){}

    // check health elasticsearch
    check_health()
    {
        client.cluster.health({}, function (err, resp, status) {
            console.log("-- Client Health --", resp);
        });
    }

    async create_index(name)
    {
        client.indices.create({
            index: name
        }, function (err, resp, status) {
            if (err) {
                console.log(err);
                return false
            }
        });
        return true;
    }

    async create_bulk(index, data)
    {
        console.log("indexing");
        try {
            let body = data.flatMap(doc => [{ index: { _index: index, _id: doc.id } }, doc])
            const bulkResponse = await client.bulk({ refresh: true, body })
            console.log(body);
            //console.log(bulkResponse)
            if (bulkResponse.errors) {
                const erroredDocuments = []
                // The items array has the same order of the dataset we just indexed.
                // The presence of the `error` key indicates that the operation
                // that we did for the document has failed.
                bulkResponse.items.forEach((action, i) => {
                    const operation = Object.keys(action)[0]
                    if (action[operation].error) {
                        erroredDocuments.push({
                            // If the status is 429 it means that you can retry the document,
                            // otherwise it's very likely a mapping error, and you should
                            // fix the document before to try it again.
                            status: action[operation].status,
                            error: action[operation].error,
                            operation: body[i * 2],
                            document: body[i * 2 + 1]
                        })
                    }
                })
                console.log(erroredDocuments)
            }
            const count = await client.count({ index: index })
            console.log(count)
        } catch (e) {
            console.log(e)
        }
    }

    async add_document(index, id, data) {
        client.index({
            index,
            id,
            body: data
        }, function (err, resp, status) {
            if (err) {
                console.log(err)
                return false
            }
        });
        const count = await client.count({ index: index })
        console.log(count)
        return true;
    }




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