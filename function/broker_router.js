// const {channel} =require('../db/rabbitmq')
// function brokerRouter(data) {
//     try {
//         var payload = JSON.parse(Buffer.from(data.content).toString())
//         console.log(payload.action)
//         switch (payload.action) {
//             case 'c1':
//                 console.log('c1', data)
//                 channel.ack(data)
//                 break
//             case 'c2':
//                 console.log('c2', data)
//                 channel.nack(data)
//                 break
//             case 'c3':
//                 console.log('c3', data)
//                 channel.ack(data)
//                 break
//             default:
//                 channel.nack(data)
//                 break
//         }
//     } catch (error) {
//         console.error('Error processing message:', error)
//         channel.nack(data)
//         // Handle error if needed
//     }
// }
//     module.exports = brokerRouter