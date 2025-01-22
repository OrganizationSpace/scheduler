// agendaJobs.js
require('dotenv').config()
const axios = require('axios')
const agenda = require('../../agenda_config')
const { attestation, sign } = require('../../function/signature')

agenda.define('inderact trickle', (job) => {
	console.log('EXECUTION Triggered')

	// Make a POST request using axios
	const baseUrl_Function = process.env.FUNCTION_EVENT_API;
	try {
		// const signature = sign()
		const dataToSend = job.attrs.data
		axios.post(
			//'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-f9570e36-6ae9-4731-9b97-ad0ee5dd709a/sample/trickle',
			`${baseUrl_Function}/inderact/trickle`,
			dataToSend,
			{
				headers: {
					'X-Require-Whisk-Auth': '1234567890',
				},
			}
		)
		console.log('EXECUTION started')
		//console.log(dataToSend)
	} catch (error) {
		//console.error('Error:', error.message)
	}
})

module.exports = agenda