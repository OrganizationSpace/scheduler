const Job_ = require('../schema/job')

const agenda = require('../agenda_config')

class Indesk {
	//garbage collector

	async garbageTicket() {
		try {
			//	await agenda.now('indesk garbage ticket', {})
			await agenda.every('30 03 * * *', 'indesk garbage ticket') //08 mins , 12 hour
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}

module.exports = Indesk
