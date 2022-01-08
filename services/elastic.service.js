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
        console.log("indexing " + index);
        try {
            let body = data.flatMap(doc => [{ index: { _index: index, _id: doc.id } }, doc])
            const bulkResponse = await client.bulk({ refresh: true, body })
            console.log(bulkResponse)
            if (bulkResponse.errors) {
                console.log("error" + bulkResponse.errors)
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
            return false
        }
        return true
    }

    async add_document(index, id, data) {
        try {
            await client.index({
                index,
                id,
                body: data
            }, function (err, resp, status) {
                if (err) {
                    console.log(err)
                    return false
                }
                if(resp) {
                    console.log(resp)
                }
            });
            // const count = await client.count({ index: index })
            // console.log(count);
        } catch (e) {
            console.log(e)
            return false
        }
        return true;
    }

}
const elasticService = new ElasticService()
module.exports = elasticService;