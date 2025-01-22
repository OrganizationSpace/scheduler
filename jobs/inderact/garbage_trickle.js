// agendaJobs.js
require('dotenv').config()
const axios = require('axios')
const agenda = require('../../agenda_config')

agenda.define('inderact garbage trickle', (job) => {
	console.log('EXECUTION Triggered TRICKLE GARBAGE')
	const dataToSend = job.attrs.data
	const baseUrl_Function = process.env.FUNCTION_EVENT_API;

	// Make a POST request using axios
	try {
		axios.post(
			`${baseUrl_Function}/inderact/garbage-trickle`,
			dataToSend,
			{
				headers: {
					'X-Require-Whisk-Auth': '1234567890',
				},
			}
		)

		console.log('EXECUTION started')
	} catch (error) {
		//console.error('Error:', error.message)
	}
})

module.exports = agenda