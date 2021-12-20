var fs = require('fs');
var request = require('request');
var amqp = require('amqplib/callback_api');
require('dotenv').config()

// amqp.connect('amqps://ekstlczn:tNUs-dhQ_vIGc9bLmTFcmzvpptX2LVsK@gerbil.rmq.cloudamqp.com/ekstlczn', function(err, conn) {
//     conn.createChannel(function(err, ch) {
//         var q = 'movieUrls';
//
//         ch.assertQueue(q, {durable: false});
//         console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
//         ch.consume(q, function(msg) {
//             console.log(" [x] Received %s", msg.content.toString());
//             var url = msg.content.toString();
//             console.log(url);
//         }, {noAck: true});
//     });
// });

amqp.connect(process.env.amqpUrl, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'task_queue';

        channel.assertQueue(queue, {
            durable: true
        });
        channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function(msg) {
            var secs = msg.content.toString().split('.').length - 1;

            console.log(" [x] Received %s", msg.content.toString());
            setTimeout(function() {
                console.log(" [x] Done");
                channel.ack(msg);
            }, secs * 1000);
        }, {
            // manual acknowledgment mode,
            // see ../confirms.html for details
            noAck: false
        });
    });
});