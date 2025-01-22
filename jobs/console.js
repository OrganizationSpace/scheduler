// agendaJobs.js
const axios = require('axios')
const agenda = require('../agenda_config')

agenda.define('console', async (job) => {
	console.log('console triggered ')
})

module.exports = agenda
