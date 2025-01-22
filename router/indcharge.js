// const express = require('express')

// const Subscription=require('../controller/subscription')
// const agenda = require('../agenda_config')

// const router = express.Router();

// const subscription= new Subscription();

// router.use(express.json());

// router.post('/scheduler', async (req, res) => {
// 	try {
// 		const subscription_scheduler = await subscription.subscriptionScheduler({

// 		});
// 		res.status(200).json({
// 			success: true,
// 			message: ' successfully',
// 			data: subscription_scheduler,
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ success: false, message: error.message, error });
// 	}
// });

// module.exports = router
