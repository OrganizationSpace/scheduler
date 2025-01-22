// agendaConfig.js
require('dotenv').config()
const Agenda = require('agenda')
const connection = {
	db: {
		address: process.env.MYDB_CONNECTION,
		collection: 'job_',
	},
}

const agenda = new Agenda(connection)

module.exports = agenda
//'mongodb+srv://venkatesh:8903273610@mindvisiontechnologies.p9txv7b.mongodb.net/scheduler',
