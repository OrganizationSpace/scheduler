// agendaJobs.js
require('dotenv').config()
const axios = require('axios')
const agenda = require('../../agenda_config')

agenda.define('inderact garbage campaign', (job) => {
	console.log('EXECUTION Triggered CAMPAIGN GARBAGE')
	const dataToSend = job.attrs.data

	// Make a POST request using axios
	const baseUrl_Function = process.env.FUNCTION_EVENT_API;
	try {
		axios.post(
			`${baseUrl_Function}/inderact/garbage-campaign`,
			dataToSend,
			{
				headers: {
					'X-Require-Whisk-Auth': '1234567890',
				},
			}
		)

		console.log('EXECUTION started')
	} catch (error) {
		////console.error('Error:', error.message)
	}
})

module.exports = agenda