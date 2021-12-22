var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client( {
    hosts: [
        'https://elastic:O6sB2bEp1SslTOhxSGJY@coinv2-elasticsearch.teknix.vn'
    ]
});

module.exports = client;
