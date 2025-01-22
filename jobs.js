// // agendaJobs.js
// const axios = require('axios')
// const agenda = require('./agenda_config')

// // agenda.define('console', async (job) => {
// // 	console.log('console triggered ')
// // })

// // agenda.define('subscription', async (job) => {
// // 	console.log('subscription triggered ')
// // 	const dataToSend = { date: '2024-02-22T12:55:38.059Z' }
// // 	try {
// // 		axios.post(
// // 			'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-f9570e36-6ae9-4731-9b97-ad0ee5dd709a/sample/subscription',
// // 			dataToSend
// // 		)

// // 		console.log('EXECUTION started')
// // 	} catch (error) {
// // 		console.error('Error:', error.message)
// // 	}
// // })

// // agenda.define('inderact campaign', (job) => {
// // 	console.log('EXECUTION Triggered')
// // 	const dataToSend = job.attrs.data

// // 	// Make a POST request using axios
// // 	try {
// // 		axios.post(
// // 			'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-f9570e36-6ae9-4731-9b97-ad0ee5dd709a/sample/welcome',
// // 			dataToSend
// // 		)

// // 		console.log('EXECUTION started')
// // 	} catch (error) {
// // 		console.error('Error:', error.message)
// // 	}
// // })

// // agenda.define('inderact trickle', (job) => {
// // 	console.log('EXECUTION Triggered')

// // 	// Make a POST request using axios
// // 	try {
// // 		const dataToSend = job.attrs.data
// // 		axios.post(
// // 			'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-f9570e36-6ae9-4731-9b97-ad0ee5dd709a/sample/trickle',
// // 			dataToSend
// // 		)
// // 		console.log('EXECUTION started')
// // 	} catch (error) {
// // 		console.error('Error:', error.message)
// // 	}
// // })

// module.exports = agenda
