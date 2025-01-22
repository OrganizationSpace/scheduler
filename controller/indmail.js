const Job_ = require('../schema/job')

const agenda = require('../agenda_config')

class Indmail {
	async scheduleCampaign({ scheduled_at, cid, workspace, is_scheduled }) {
		try {
			if (is_scheduled) {
				// console.log('_____________')
				// console.log(scheduled_at)
				var iso = agenda.schedule(scheduled_at, 'indmail campaign', {
					cid: cid,
					workspace: workspace,
				})
				//console.log('scheduled', iso)
			} else {
				agenda.now('indmail campaign', {
					cid: cid,
					workspace: workspace,
				})
			}
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async scheduleTrickle({ trickle_id, sequence_id, scheduled_at }) {
		console.log('CONTROLER  ok')
		try {
			var result = await agenda.schedule(scheduled_at, 'indmail trickle', {
				trickle_id: trickle_id,
				sequence_id: sequence_id,
				is_lateral: false,
			})

			return result
		} catch (error) {
			console.error(error)
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
			const result = await agenda.schedule(scheduled_at, 'indmail trickle', {
				trickle_id: trickle_id,
				sequence_id: sequence_id,
				is_lateral: true,
				is_last: is_last,
			})
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async cancelCampaign({ campaign_id }) {
		try {
			const result = await Job_.deleteOne({
				name: 'indmail campaign',
				'data.cid': campaign_id,
			})
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async cancelSequenceInTrickle({ trickle_id, sequence_id }) {
		try {
			const result = await Job_.deleteOne({
				name: 'indmail trickle',
				'data.trickle_id': trickle_id,
				'data.sequence_id': sequence_id,
			})
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async cancelTrickle({ trickle_id }) {
		try {
			const result = await Job_.deleteMany({
				name: 'indmail trickle',
				'data.trickle_id': trickle_id,
			})
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	//garbage collector

	async garbageCampaign() {
		try {
			//await agenda.now('indmail garbage campaign', {})
			await agenda.every('20 03 * * *', 'indmail garbage campaign') //08 mins , 12 hour
		} catch (error) {
			console.error(error)
			throw error
		}
	}
	async garbageTrickle() {
		try {
			//await agenda.now('indmail garbage trickle', {})
			await agenda.every('25 03 * * *', 'indmail garbage trickle') //08 mins , 12 hour
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}

module.exports = Indmail
