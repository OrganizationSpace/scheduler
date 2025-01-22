// agendaJobs.js
const axios = require('axios')
const agenda = require('../../agenda_config')

agenda.define('indesk garbage ticket', (job) => {
	console.log('EXECUTION Triggered ticket GARBAGE')
	const dataToSend = job.attrs.data

	// Make a POST request using axios
	try {
		axios.post(
			'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-f9570e36-6ae9-4731-9b97-ad0ee5dd709a/indesk/garbage-ticket',
			//'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-699206d5-5221-482d-9e37-c6a0455672bc/indesk/garbage-ticket',
			dataToSend,
			{
				headers: {
					'X-Require-Whisk-Auth': '1234567890',
				},
			}
		)

		console.log('EXECUTION started')
	} catch (error) {
		console.error('Error:', error.message)
	}
})

module.exports = agenda
