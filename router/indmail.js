// schedulerRoutes.js
const express = require('express')
//const Scheduler = require('../schema/scheduler')
const Indmail = require('../controller/indmail')
//const filterSequence=require('../function/filter_sequence')
const { attestation, sign } = require('../function/signature')
const router = express.Router()

const indmail = new Indmail()

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

router.post('/campaign', attestation, async (req, res, next) => {
	try {
		const { scheduled_at, cid, workspace, is_scheduled } = req.body

		const campaign_scheduler = await indmail.scheduleCampaign({
			scheduled_at,
			cid,
			workspace,
			is_scheduled,
		})

		res.status(200).json({
			success: true,
			// message: 'Campaign scheduled successfully',
			message: 'success',
		})
	} catch (error) {
		console.error(error)
		next(error)
	}
})

router.post('/trickle', attestation, async (req, res) => {
	//console.log('ROUTER ok')
	try {
		const { _id, drip, is_scheduled } = req.body
		const sequence = drip.sequence
		const trickle_id = _id
		//console.log(sequence)

		for (s of sequence) {
			const scheduled_at = s.scheduled_at
			const sequence_id = s._id

			// var result = { trickle_id, scheduled_at, sequence_id }
			// console.log(result)

			const schedule_trickle = await indmail.scheduleTrickle({
				trickle_id,
				sequence_id,
				scheduled_at,
			})

			// var iso = await agenda.schedule(scheduled_at, 'inderact trickle', {
			// 	trickle_id: trickle_id,
			// 	sequence_id: sequence_id,
			// 	is_lateral: false,
			// })
			//console.log('schedule_trickle', schedule_trickle)
		}
		res.status(200).json({ message: 'success' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

// router.post('/trickle/lateral', attestation, async (req, res) => {
// 	const { _id, drip } = req.body
// 	const full_sequence = drip.sequence
// 	const sequence = filterSequence(full_sequence)

// 	const trickle_id = _id
// 	// console.log('######I n d m a i l#####')
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
// 		const is_last = i === sequence.length - 1
// 		const data = {
// 			trickle_id,
// 			sequence_id,
// 			scheduled_at,
// 			is_last,
// 		}
		

// 		const lateral_trickle = await indmail.addLateralsToTrickle({
// 			trickle_id,
// 			sequence_id,
// 			scheduled_at,
// 			is_last,
// 		})

// 		//console.log('indmail scheduler ', lateral_trickle)
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
			const is_last = i === sequence.length - 1;
			const data = {
				trickle_id,
				sequence_id,
				scheduled_at,
				is_last,
			};

			const lateral_trickle = await indmail.addLateralsToTrickle({
				trickle_id,
				sequence_id,
				scheduled_at,
				is_last,
			});

			// Uncomment for debugging (if needed)
			// console.log('indmail scheduler ', lateral_trickle);
		}

		res.status(200).json({ message: 'success' });
	} catch (error) {
		console.error('Error processing trickle/lateral:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});


router.post('/campaign/cancel', attestation, async (req, res) => {
	try {
		const cancel_campaign = await indmail.cancelCampaign({
			campaign_id: req.body.campaign_id,
		})
		res.status(200).json({
			success: true,
			message: 'Campaign canceled successfully',
			data: cancel_campaign,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/trickle/sequence/cancel', attestation, async (req, res) => {
	try {
		const trickle_cancel = await indmail.cancelSequenceInTrickle({
			trickle_id: req.body.trickle_id,
			sequence_id: req.body.sequence_id,
		})
		res.status(200).json({
			success: true,
			message: 'Trickle sequence canceled successfully',
			data: trickle_cancel,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

router.post('/trickle/cancel', attestation, async (req, res) => {
	try {
		const trickle_cancel = await indmail.cancelTrickle({
			trickle_id: req.body.trickle_id,
		})
		res.status(200).json({
			success: true,
			message: 'Trickle canceled successfully',
			data: trickle_cancel,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, message: error.message, error })
	}
})

module.exports = router
