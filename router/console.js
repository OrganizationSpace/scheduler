const express = require('express')
const agenda = require('../agenda_config')

const router = express.Router()

router.post('/', (req, res) => {
	agenda.schedule('1 minute', 'console', { seconds: '60' })
	res.send('Hello, World!')
})
module.exports = router
