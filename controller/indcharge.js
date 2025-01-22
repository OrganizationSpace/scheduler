//const express = require('express');
const agenda = require('../agenda_config')

class Indcharge {
	async expireSubscription() {
		try {
			const result = await agenda.every('00 03 * * *', 'indcharge subscription') //08 mins , 12 hour

			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}

module.exports = Indcharge
