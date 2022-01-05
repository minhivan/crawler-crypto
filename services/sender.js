var amqp = require('amqplib/callback_api');
require('dotenv').config()

function test(index){
    index = 350000+index
    return 'http://www.imdb.com/title/tt0'+index
}


// amqp.connect(url, function(err, conn) {
//     conn.createChannel(function(err, ch) {
//         var q = 'movieUrls';
//         ch.assertQueue(q, {durable: false});
//         for (var i = 0; i < 100; i++) {
//             var urlString = test(i);
//             ch.sendToQueue(q, new Buffer(urlString));
//             console.log("Sent "+urlString);
//         }
//     });
//     setTimeout(function() { conn.close(); process.exit(0) }, 500);
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
        var msg = process.argv.slice(2).join(' ') || "Hello World!";

        channel.assertQueue(queue, {
            durable: true
        });
        channel.sendToQueue(queue, Buffer.from(msg), {
            persistent: true
        });
        console.log(" [x] Sent '%s'", msg);
    });
    // setTimeout(function() {
    //     connection.close();
    //     process.exit(0)
    // }, 500);
});