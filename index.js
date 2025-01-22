const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const axios = require('axios')
// const Scheduler = require('./schema/scheduler')
const errorHandler = require('./error_handler')
const { conn } = require('./db/mongodb')
const connectRabbitMQ = require('./rabbitmq/rabbitmq')
const { setChannel, sendToQueue, ack, nack } = require('./rabbitmq/channel')
//const {channel, connection } = require('./db/rabbitmq')
const app = express()
const PORT = 1000
const agenda = require('./agenda_config')
const jobs = require('./jobs')
require('./jobs/indcharge/subscription')
require('./jobs/console')
require('./jobs/inderact/campaign')
require('./jobs/inderact/garbage_campaign')
require('./jobs/inderact/birthday_wisher')
require('./jobs/inderact/trickle')
require('./jobs/inderact/garbage_trickle')
require('./jobs/inderact/garbage_message')
require('./jobs/indmail/campaign')
require('./jobs/indmail/garbage_campaign')
require('./jobs/indmail/trickle')
require('./jobs/indmail/garbage_trickle')
require('./jobs/indesk/garbage_ticket')
require('./jobs/indspot/garbage_event')
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const Indcharge = require('./controller/indcharge')
const Indesk = require('./controller/indesk')
const Indspot = require('./controller/indspot')
const Inderact = require('./controller/inderact')
const Indmail = require('./controller/indmail')

const inderact = require('./router/inderact')
const console = require('./router/console')
const indmail = require('./router/indmail')
//const subscription=require('./router/subscription')

const _indcharge = new Indcharge()
const _indesk = new Indesk()
const _indspot = new Indspot()
const _inderact = new Inderact()
const _indmail = new Indmail()

app.use('/inderact', inderact)
app.use('/console', console)
app.use('/indmail', indmail)
//app.use('/subscription',subscription)

connectRabbitMQ()
	.then((ch) => {
		setChannel(ch)
	})
	.catch((error) => {
		////console.error('Error connecting to RabbitMQ', error)
	})

app.listen(PORT, async () => {
	try {
		await agenda.start()
		await _indcharge.expireSubscription()

		await _inderact.birthdayWisher()
		await _inderact.garbageCampaign()
		await _inderact.garbageTrickle()
		await _inderact.garbageMessage()

		await _indmail.garbageCampaign()
		await _indmail.garbageTrickle()

		await _indspot.garbageEvent()

		await _indesk.garbageTicket()
		// await agenda.every('14 18 * * *', 'subscription')
	} catch (error) {
		console.log('Error connecting to Agenda:', error)
	}
})

// Define a route for the root URL
app.get('/', (req, res) => {
	res.send('S C H E D U L E R !')
})
app.post('/', async (req, res) => {
	try {
		const success = sendToQueue('scheduler', 'PREFERENCE_INIT', {
			name: 'github',
		})
		if (success) {
			res.status(200).send(`Message sent to queue: `)
		} else {
			res.status(500).send('Failed to send message to queue')
		}
	} catch (error) {
		////console.error('Failed to send message to queue', error)
		res.status(500).send('Failed to send message to queue')
	}
})
// app.post('/console', (req, res) => {
// 	agenda.schedule('1 minute', 'console', { seconds: '60' })
// 	res.send('Hello, World!')
// // })
// app.get('/list', async (req, res) => {
// 	try {
// 		const list = await Scheduler.find({})
// 		res
// 			.status(200)
// 			.json({ success: true, message: 'fetched successfully', data: list })
// 	} catch (error) {
// 		res.status(500).json({ success: false, message: error.message, error })
// 		console.log(error)
// 	}
// })

app.use(errorHandler)

// agenda.define('console', async (job) => {
// 	console.log('console triggered ')
// })

// agenda.define('subscription', async (job) => {
// 	console.log('subscription triggered ')
// 	const dataToSend = { date: '2024-02-22T12:55:38.059Z' }
// 	try {
// 		axios.post(
// 			'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-f9570e36-6ae9-4731-9b97-ad0ee5dd709a/sample/subscription',
// 			dataToSend
// 		)

// 		console.log('EXECUTION started')
// 	} catch (error) {
// 		//console.error('Error:', error.message)
// 	}
// })

// agenda.define('inderact campaign', (job) => {
// 	console.log('EXECUTION Triggered')
// 	const dataToSend = job.attrs.data

// 	// Make a POST request using axios
// 	try {
// 		axios.post(
// 			'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-f9570e36-6ae9-4731-9b97-ad0ee5dd709a/sample/welcome',
// 			dataToSend
// 		)

// 		console.log('EXECUTION started')
// 	} catch (error) {
// 		//console.error('Error:', error.message)
// 	}
// })

// agenda.define('inderact trickle', (job) => {
// 	console.log('EXECUTION Triggered')

// 	// Make a POST request using axios
// 	try {
// 		const dataToSend = job.attrs.data
// 		axios.post(
// 			'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-f9570e36-6ae9-4731-9b97-ad0ee5dd709a/sample/trickle',
// 			dataToSend
// 		)
// 		console.log('EXECUTION started')
// 	} catch (error) {
// 		//console.error('Error:', error.message)
// 	}
// })

// function filterSequence(sequence) {
// 	const currentDate = new Date()

// 	return sequence.filter((item) => {
// 		const scheduledAtDate = new Date(item.scheduled_at)
// 		return scheduledAtDate < currentDate
// 	})
// }

// app.post('/inderact/campaign', (req, res) => {
// 	const { scheduled_at, cid, is_scheduled } = req.body
// 	if (is_scheduled) {
// 		var iso = agenda.schedule(scheduled_at, 'inderact campaign', {
// 			campaign_id: cid,
// 		})
// 	} else {
// 		agenda.now('inderact campaign', { campaign_id: cid })
// 	}

// 	res.status(200).json({ message: 'success' })
// })

// app.post('/inderact/trickle', async (req, res) => {
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

// app.post('/inderact/trickle/lateral', async (req, res) => {
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

// Start the server

// app.post('/inderact/campaign/cancel', async (req, res) => {
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

// app.post('/inderact/trickle/sequence/cancel', async (req, res) => {
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

// app.post('/inderact/trickle/cancel', async (req, res) => {
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