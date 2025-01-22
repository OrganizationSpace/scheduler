const Job_ = require('../schema/job')

const agenda = require('../agenda_config')

class Inderact {
	async scheduleCampaign({ scheduled_at, cid, is_scheduled }) {
		console.log(
			`Scheduling campaign ${cid} at ${scheduled_at} is_scheduled: ${is_scheduled}`
		);
		
		try {
			if (is_scheduled) {
				var iso = await agenda.schedule(scheduled_at, 'inderact campaign', {
					campaign_id: cid,
				})
				//console.log('scheduled', iso)
			} else {
				await agenda.now('inderact campaign', { campaign_id: cid })
			}
		} catch (error) {
			////console.error(error)
			throw error
		}
	}

	async scheduleTrickle({ trickle_id, sequence_id, scheduled_at }) {
		try {
			var result = await agenda.schedule(scheduled_at, 'inderact trickle', {
				trickle_id: trickle_id,
				sequence_id: sequence_id,
				is_lateral: false,
			})

			return result
		} catch (error) {
			////console.error(error)
			throw error
		}
	}

	async addLateralsToTrickle({
		trickle_id,
		sequence_id,
		scheduled_at,
		is_last,
	}) {
		try {
			var result = await agenda.schedule(scheduled_at, 'inderact trickle', {
				trickle_id: trickle_id,
				sequence_id: sequence_id,
				is_lateral: true,
				is_last: is_last,
			})
			return result
		} catch (error) {
			////console.error(error)
			throw error
		}
	}

	async cancelCampaign({ campaign_id }) {
		try {
			const result = await Job_.deleteOne({
				'data.campaign_id': campaign_id,
			})
			return result
		} catch (error) {
			////console.error(error)
			throw error
		}
	}

	async cancelSequenceInTrickle({ trickle_id, sequence_id }) {
		try {
			const result = await Job_.deleteOne({
				'data.trickle_id': trickle_id,
				'data.sequence_id': sequence_id,
			})
			return result
		} catch (error) {
			////console.error(error)
			throw error
		}
	}

	async cancelTrickle({ trickle_id }) {
		try {
			const result = await Job_.deleteMany({
				'data.trickle_id': trickle_id,
			})
			return result
		} catch (error) {
			////console.error(error)
			throw error
		}
	}

	//garbage collectors

	async garbageCampaign() {
		try {
			//await agenda.now('inderact garbage campaign', {})
			await agenda.every('10 03 * * *', 'inderact garbage campaign') //08 mins , 12 hour
		} catch (error) {
			////console.error(error)
			throw error
		}
	}
	async garbageTrickle() {
		try {
			//	await agenda.now('inderact garbage trickle', {})
			await agenda.every('15 03 * * *', 'inderact garbage trickle') //08 mins , 12 hour
		} catch (error) {
			////console.error(error)
			throw error
		}
	}

	async garbageMessage() {
		try {
			//await agenda.now('inderact garbage message', {})
			await agenda.every('05 03 * * *', 'inderact garbage message') //08 mins , 12 hour
		} catch (error) {
			////console.error(error)
			throw error
		}
	}
	async birthdayWisher() {
		try {
			//await agenda.now('inderact garbage message', {})
			await agenda.every('22 11 * * *', 'inderact birthday wisher') //08 mins , 12 hour
		} catch (error) {
			////console.error(error)
			throw error
		}
	}
}

module.exports = Inderact