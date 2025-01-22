// agendaJobs.js
const axios = require('axios')
const agenda = require('../../agenda_config')
const errorHandler = require('../../error_handler')
const { attestation, sign } = require('../../function/signature')

agenda.define('indmail trickle', (job) => {
	console.log('EXECUTION Triggered')
	console.log('JOBS ok')

	// Make a POST request using axios
	try {
		// const signature = sign()
		const dataToSend = job.attrs.data
		// console.log('^^^^^^^^^')
		// console.log(dataToSend)
		// console.log('^^^^^^^^^')
		axios.post(
			'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-f9570e36-6ae9-4731-9b97-ad0ee5dd709a/indmail/trickle',
			//'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-699206d5-5221-482d-9e37-c6a0455672bc/indmail/trickle',
			dataToSend,
			{
				headers: {
					'X-Require-Whisk-Auth': '1234567890',
				},
			}
		)
		console.log('EXECUTION started')
	} catch (error) {
		console.error('Error:', 'A X I O S')
		errorHandler(error, null, null, null)
	}
})

module.exports = agenda
