const Job_ = require('../schema/job')

const agenda = require('../agenda_config')

class Indspot {
	//garbage collector

	async garbageEvent() {
		try {
			//await agenda.now('indspot garbage event', {})
			await agenda.every('35 03 * * *', 'indspot garbage event') //08 mins , 12 hour
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}

module.exports = Indspot
