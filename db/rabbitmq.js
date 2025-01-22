// const amqp = require('amqplib')
// const brokerRouter=require('../function/broker_router')
// var channel, connection
// connectQueue() // call the connect function
// async function connectQueue() {
//     try {
//         const amqpServer = 'amqp://dev:dev@142.93.221.104:5672'
//         connection = await amqp.connect(amqpServer)
//         channel = await connection.createChannel()
//         console.log('Connected to RabbitMQ ')
//         channel.consume('scheduler', (data) => {
//             brokerRouter(data)
//         })
//     } catch (error) {
// 	await channel.close()
//     await connection.close()
//         console.log(error)
//     }
// }
// module.exports = { channel, connection }
