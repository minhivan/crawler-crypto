var amqp = require('amqplib/callback_api');
require('dotenv').config()



amqp.connect(process.env.amqpUrl, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'task_queue';

        for (var i = 0; i < 100; i++) {
            var msg = "Sent message " + i;

            channel.assertQueue(queue, {
                durable: true
            });
            channel.sendToQueue(queue, Buffer.from(msg), {
                persistent: true
            });
            console.log(" [x] Sent '%s'", msg);
        }

    });
    setTimeout(function() {
        connection.close();
        process.exit(0)
    }, 50000);
});