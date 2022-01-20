const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client( {
    hosts: [
        'https://user:pass@elastic-host'
    ]
});

module.exports = client;
