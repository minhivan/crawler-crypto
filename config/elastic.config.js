const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client( {
    hosts: [
        //'https://elastic:O6sB2bEp1SslTOhxSGJY@coinv2-elasticsearch.teknix.vn',
        //'https://elastic:BPZZqCipwaxJ8Pd2yTi6@beta-elasticsearch.teknix.vn',
        'https://elastic:S6tr3w9rTVJRAqUbHA5U@test-elasticsearch.teknix.vn'
    ]
});

module.exports = client;
