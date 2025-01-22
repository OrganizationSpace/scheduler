// // schedulerRoutes.js
// const express = require('express')
// // const Scheduler = require('../schema/scheduler')
// const Inderact = require('../controller/inderact')
// const { attestation, sign } = require('../function/signature')
// //const filterSequence= require('../function/filter_sequence')
// //const agenda = require('../agenda_config')

// const router = express.Router()

// const inderact = new Inderact()

// router.use(express.json())


// function filterSequence(sequence) {
// 	const currentDate = new Date()

// 	return sequence.filter((item) => {
// 		const scheduledAtDate = new Date(item.scheduled_at)
// 		return scheduledAtDate < currentDate && item.status !== 'CANCELLED'
// 	})
// }


// router.post('/campaign', attestation, async (req, res, next) => {
	
// 	try {
// 		const { scheduled_at, cid, is_scheduled } = req.body

// 		const campaign_scheduler = await inderact.scheduleCampaign({
// 			scheduled_at,
// 			cid,
// 			is_scheduled,
// 		})

// 		res.status(200).json({
// 			success: true,
// 			// message: 'Campaign scheduled successfully',
// 			message: 'success',
// 		})
// 	} catch (error) {
// 		//console.error(error)
// 		next(error)
// 	}
// })


// router.post('/trickle', attestation, async (req, res) => {
// 	try {
// 		const { _id, drip, is_scheduled } = req.body
// 		const sequence = drip.sequence
// 		const trickle_id = _id
// 		console.log("++++++++++++++++++++++++++++++++++++++++++++++++++");
// 		console.log(sequence)
// 		console.log("++++++++++++++++++++++++++++++++++++++++++++++++++");

// 		for (s of sequence) {
// 			const scheduled_at = s.scheduled_at
// 			const sequence_id = s._id

// 			// var result = { trickle_id, scheduled_at, sequence_id }
// 			// console.log(result)

// 			const schedule_trickle = await inderact.scheduleTrickle({
// 				trickle_id,
// 				sequence_id,
// 				scheduled_at,
// 			})

// 			// var iso = await agenda.schedule(scheduled_at, 'inderact trickle', {
// 			// 	trickle_id: trickle_id,
// 			// 	sequence_id: sequence_id,
// 			// 	is_lateral: false,
// 			// })
// 			//console.log(schedule_trickle)
// 		}
// 		res.status(200).json({ message: 'success' })
// 	} catch (error) {
// 		//console.error(error)
// 		res.status(500).json({ success: false, message: error.message, error })
// 	}
// })


// router.post('/trickle/lateral', attestation, async (req, res) => {
// 	try {
// 		const { _id, drip } = req.body;
// 		const full_sequence = drip.sequence;
// 		const sequence = filterSequence(full_sequence);

// 		const trickle_id = _id;

// 		for (let i = 0; i < sequence.length; i++) {
// 			const s = sequence[i];
// 			const scheduled_at = s.scheduled_at;
// 			const sequence_id = s._id;
// 			const is_last = i === sequence.length - 1; // Check if it's the last element

// 			await inderact.addLateralsToTrickle({
// 				trickle_id,
// 				sequence_id,
// 				scheduled_at,
// 				is_last,
// 			});
// 		}

// 		res.status(200).json({ message: 'success' });
// 	} catch (error) {
// 		//console.error('Error processing trickle/lateral:', error);
// 		res.status(500).json({ message: 'Internal server error' });
// 	}
// });

// router.post('/campaign/cancel', attestation, async (req, res) => {
// 	try {
// 		const cancel_campaign = await inderact.cancelCampaign({
// 			campaign_id: req.body.campaign_id,
// 		})
// 		res.status(200).json({
// 			success: true,
// 			message: 'Campaign canceled successfully',
// 			data: cancel_campaign,
// 		})
// 	} catch (error) {
// 		//console.error(error)
// 		res.status(500).json({ success: false, message: error.message, error })
// 	}
// })



// router.post('/trickle/sequence/cancel', attestation, async (req, res) => {
// 	try {
// 		const trickle_cancel = await inderact.cancelSequenceInTrickle({
// 			trickle_id: req.body.trickle_id,
// 			sequence_id: req.body.sequence_id,
// 		})
// 		res.status(200).json({
// 			success: true,
// 			message: 'Trickle sequence canceled successfully',
// 			data: trickle_cancel,
// 		})
// 	} catch (error) {
// 		//console.error(error)
// 		res.status(500).json({ success: false, message: error.message, error })
// 	}
// })


// router.post('/trickle/cancel', attestation, async (req, res) => {
// 	try {
// 		const trickle_cancel = await inderact.cancelTrickle({
// 			trickle_id: req.body.trickle_id,
// 		})
// 		res.status(200).json({
// 			success: true,
// 			message: 'Trickle canceled successfully',
// 			data: trickle_cancel,
// 		})
// 	} catch (error) {
// 		//console.error(error)
// 		res.status(500).json({ success: false, message: error.message, error })
// 	}
// })


// module.exports = router
// schedulerRoutes.js
const express = require('express')
// const Scheduler = require('../schema/scheduler')
const Inderact = require('../controller/inderact')
const { attestation, sign } = require('../function/signature')
//const filterSequence= require('../function/filter_sequence')
//const agenda = require('../agenda_config')

const router = express.Router()

const inderact = new Inderact()

router.use(express.json())

// function filterSequence(sequence) {
// 	const currentDate = new Date()

// 	return sequence.filter((item) => {
// 		const scheduledAtDate = new Date(item.scheduled_at)
// 		return scheduledAtDate < currentDate
// 	})
// }

function filterSequence(sequence) {
	const currentDate = new Date()

	return sequence.filter((item) => {
		const scheduledAtDate = new Date(item.scheduled_at)
		return scheduledAtDate < currentDate && item.status !== 'CANCELLED'
	})
}

// router.post('/campaign', async (req, res) => {
// 	const { scheduled_at, cid, is_scheduled } = req.body

// 	if (is_scheduled) {
// 		var iso = agenda.schedule(scheduled_at, 'inderact campaign', {
// 			campaign_id: cid,
// 		})
// 		console.log("scheduled",iso);
// 	} else {
// 		agenda.now('inderact campaign', { campaign_id: cid })
// 	}

// 	res.status(200).json({ message: 'success' })
// })

// router.post('/trickle', async (req, res) => {
// 	const { _id, drip, is_scheduled } = req.body
// 	const sequence = drip.sequence
// 	const trickle_id = _id
// 	console.log(sequence)

// 	for (s of sequence) {
// 		const scheduled_at = s.scheduled_at
// 		const sequence_id = s._id

// 		var result = { trickle_id, scheduled_at, sequence_id }
// 		console.log(result)
// 		var iso = await agenda.schedule(scheduled_at, 'inderact trickle', {
// 			trickle_id: trickle_id,
// 			sequence_id: sequence_id,
// 			is_lateral: false,
// 		})
// 		console.log(iso)
// 	}
// 	res.status(200).json({ message: 'success' })
// })

// router.post('/trickle/lateral', async (req, res) => {
// 	const { _id, drip, is_scheduled } = req.body
// 	const full_sequence = drip.sequence
// 	const sequence = filterSequence(full_sequence)

// 	const trickle_id = _id
// 	console.log(sequence)

// 	for (s of sequence) {
// 		const scheduled_at = s.scheduled_at
// 		const sequence_id = s._id

// 		var result = { trickle_id, scheduled_at, sequence_id }
// 		console.log(result)
// 		var iso = await agenda.schedule(scheduled_at, 'inderact trickle', {
// 			trickle_id: trickle_id,
// 			sequence_id: sequence_id,
// 			is_lateral: true,
// 		})
// 		console.log(iso)
// 	}
// 	res.status(200).json({ message: 'success' })
// })

// router.post('/campaign/cancel', async (req, res) => {
// 	try {
// 		const campaign_cancel = await Scheduler.deleteOne({
// 			'data.campaign_id': req.body.campaign_id,
// 		})
// 		res.status(200).json({
// 			success: true,
// 			message: 'campaign cancel successfully',
// 			data: campaign_cancel,
// 		})
// 	} catch (error) {
// 		res.status(500).json({ success: false, message: error.message, error })
// 		console.log(error)
// 	}
// })

// router.post('/trickle/sequence/cancel', async (req, res) => {
// 	try {
// 		const trickle_cancel = await Scheduler.deleteOne({
// 			'data.trickle_id': req.body.trickle_id,
// 			'data.sequence_id': req.body.sequence_id,
// 		})
// 		res.status(200).json({
// 			success: true,
// 			message: 'trickle  sequence cancel successfully',
// 			data: trickle_cancel,
// 		})
// 	} catch (error) {
// 		res.status(500).json({ success: false, message: error.message, error })
// 		console.log(error)
// 	}
// })

// router.post('/trickle/cancel', async (req, res) => {
// 	try {
// 		const trickle_cancel = await Scheduler.deleteMany({
// 			'data.trickle_id': req.body.trickle_id,
// 		})
// 		res.status(200).json({
// 			success: true,
// 			message: 'trickle cancel successfully',
// 			data: trickle_cancel,
// 		})
// 	} catch (error) {
// 		res.status(500).json({ success: false, message: error.message, error })
// 		console.log(error)
// 	}
// })

// module.exports = router
///////////////
router.post('/campaign', attestation, async (req, res, next) => {
	
	try {
		const { scheduled_at, cid, is_scheduled } = req.body

		const campaign_scheduler = await inderact.scheduleCampaign({
			scheduled_at,
			cid,
			is_scheduled,
		})

		res.status(200).json({
			success: true,
			// message: 'Campaign scheduled successfully',
			message: 'success',
		})
	} catch (error) {
		//console.error(error)
		next(error)
	}
})

///////////////////////
// router.post('/campaign', async (req, res) => {
// 	const { scheduled_at, cid, is_scheduled } = req.body

// 	if (is_scheduled) {
// 		var iso = agenda.schedule(scheduled_at, 'inderact campaign', {
// 			campaign_id: cid,
// 		})
// 		console.log("scheduled",iso);
// 	} else {
// 		agenda.now('inderact campaign', { campaign_id: cid })
// 	}

// 	res.status(200).json({ message: 'success' })
// })

// router.post('/trickle', async (req, res) => {
// 	try{
// 	const { _id, drip, is_scheduled } = req.body

// 	const sequence = drip.sequence
// 	const trickle_id = _id
// 	console.log(sequence)

// 	for (s of sequence) {
// 		const scheduled_at = s.scheduled_at
// 		const sequence_id = s._id

// 		var result = { trickle_id, scheduled_at, sequence_id }
// 		console.log(result)
// 		var iso = await agenda.schedule(scheduled_at, 'inderact trickle', {
// 			trickle_id: trickle_id,
// 			sequence_id: sequence_id,
// 			is_lateral: false,
// 		})
// 		console.log(iso)
// 	}

// 	res.status(200).json({
// 		success: true,
// 	   // message: 'Campaign scheduled successfully',
// 	  message: 'success' ,
// 	});
// } catch (error) {

// 	//console.error(error);
// 		res.status(500).json({ success: false, message: error.message, error });

// }
// });

// router.post('/trickle', async (req, res) => {
// 	const { _id, drip, is_scheduled } = req.body
// 	const sequence = drip.sequence
// 	const trickle_id = _id
// 	console.log(sequence)

// 	for (s of sequence) {
// 		const scheduled_at = s.scheduled_at
// 		const sequence_id = s._id

// 		var result = { trickle_id, scheduled_at, sequence_id }
// 		console.log(result)
// 		var iso = await agenda.schedule(scheduled_at, 'inderact trickle', {
// 			trickle_id: trickle_id,
// 			sequence_id: sequence_id,
// 			is_lateral: false,
// 		})
// 		console.log(iso)
// 	}
// 	res.status(200).json({ message: 'success' })
// })

router.post('/trickle', attestation, async (req, res) => {
	try {
		const { _id, drip, is_scheduled } = req.body
		const sequence = drip.sequence
		const trickle_id = _id
		console.log("++++++++++++++++++++++++++++++++++++++++++++++++++");
		console.log(sequence)
		console.log("++++++++++++++++++++++++++++++++++++++++++++++++++");

		for (s of sequence) {
			const scheduled_at = s.scheduled_at
			const sequence_id = s._id

			// var result = { trickle_id, scheduled_at, sequence_id }
			// console.log(result)

			const schedule_trickle = await inderact.scheduleTrickle({
				trickle_id,
				sequence_id,
				scheduled_at,
			})

			// var iso = await agenda.schedule(scheduled_at, 'inderact trickle', {
			// 	trickle_id: trickle_id,
			// 	sequence_id: sequence_id,
			// 	is_lateral: false,
			// })
			//console.log(schedule_trickle)
		}
		res.status(200).json({ message: 'success' })
	} catch (error) {
		//console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

// router.post('/trickle/lateral', attestation, async (req, res) => {
// 	const { _id, drip } = req.body
// 	const full_sequence = drip.sequence
// 	const sequence = filterSequence(full_sequence)

// 	const trickle_id = _id
// 	// console.log('###########')
// 	// console.log(sequence)
// 	// console.log('###########')

// 	// for (s of sequence) {
// 	// 	const scheduled_at = s.scheduled_at
// 	// 	const sequence_id = s._id
// 	// 	const is_last = s.is_last
// 	// 	const lateral_trickle = await inderact.addLateralsToTrickle({
// 	// 		trickle_id,
// 	// 		sequence_id,
// 	// 		scheduled_at,
// 	// 		is_last,
// 	// 	})

// 	// 	console.log('inderact scheduler ', lateral_trickle)
// 	// }
// 	for (let i = 0; i < sequence.length; i++) {
// 		const s = sequence[i]
// 		const scheduled_at = s.scheduled_at
// 		const sequence_id = s._id
// 		const is_last = i === sequence.length - 1 // Check if it's the last element
// 		const lateral_trickle = await inderact.addLateralsToTrickle({
// 			trickle_id,
// 			sequence_id,
// 			scheduled_at,
// 			is_last,
// 		})

// 		//console.log('inderact scheduler ', lateral_trickle)
// 	}

// 	res.status(200).json({ message: 'success' })
// })

router.post('/trickle/lateral', attestation, async (req, res) => {
	try {
		const { _id, drip } = req.body;
		const full_sequence = drip.sequence;
		const sequence = filterSequence(full_sequence);

		const trickle_id = _id;

		for (let i = 0; i < sequence.length; i++) {
			const s = sequence[i];
			const scheduled_at = s.scheduled_at;
			const sequence_id = s._id;
			const is_last = i === sequence.length - 1; // Check if it's the last element

			await inderact.addLateralsToTrickle({
				trickle_id,
				sequence_id,
				scheduled_at,
				is_last,
			});
		}

		res.status(200).json({ message: 'success' });
	} catch (error) {
		//console.error('Error processing trickle/lateral:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

router.post('/campaign/cancel', attestation, async (req, res) => {
	try {
		const cancel_campaign = await inderact.cancelCampaign({
			campaign_id: req.body.campaign_id,
		})
		res.status(200).json({
			success: true,
			message: 'Campaign canceled successfully',
			data: cancel_campaign,
		})
	} catch (error) {
		//console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

// router.post('/campaign/cancel', async (req, res) => {
// 	try {
// 		const campaign_cancel = await Scheduler.deleteOne({
// 			'data.campaign_id': req.body.campaign_id,
// 		})
// 		res.status(200).json({
// 			success: true,
// 			message: 'campaign cancel successfully',
// 			data: campaign_cancel,
// 		})
// 	} catch (error) {
// 		res.status(500).json({ success: false, message: error.message, error })
// 		console.log(error)
// 	}
// })

router.post('/trickle/sequence/cancel', attestation, async (req, res) => {
	try {
		const trickle_cancel = await inderact.cancelSequenceInTrickle({
			trickle_id: req.body.trickle_id,
			sequence_id: req.body.sequence_id,
		})
		res.status(200).json({
			success: true,
			message: 'Trickle sequence canceled successfully',
			data: trickle_cancel,
		})
	} catch (error) {
		//console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

// router.post('/trickle/sequence/cancel', async (req, res) => {
// 	try {
// 		const trickle_cancel = await Scheduler.deleteOne({
// 			'data.trickle_id': req.body.trickle_id,
// 			'data.sequence_id': req.body.sequence_id,
// 		})
// 		res.status(200).json({
// 			success: true,
// 			message: 'trickle  sequence cancel successfully',
// 			data: trickle_cancel,
// 		})
// 	} catch (error) {
// 		res.status(500).json({ success: false, message: error.message, error })
// 		console.log(error)
// 	}
// })

router.post('/trickle/cancel', attestation, async (req, res) => {
	try {
		const trickle_cancel = await inderact.cancelTrickle({
			trickle_id: req.body.trickle_id,
		})
		res.status(200).json({
			success: true,
			message: 'Trickle canceled successfully',
			data: trickle_cancel,
		})
	} catch (error) {
		//console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

// router.post('/trickle/cancel', async (req, res) => {
// 	try {
// 		const trickle_cancel = await Scheduler.deleteMany({
// 			'data.trickle_id': req.body.trickle_id,
// 		})
// 		res.status(200).json({
// 			success: true,
// 			message: 'trickle cancel successfully',
// 			data: trickle_cancel,
// 		})
// 	} catch (error) {
// 		res.status(500).json({ success: false, message: error.message, error })
// 		console.log(error)
// 	}
// })

module.exports = router