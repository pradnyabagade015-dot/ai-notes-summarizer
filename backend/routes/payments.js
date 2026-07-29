const express = require('express')
const protect = require('../middleware/auth')
const { createPremiumOrder, getPaymentHistory, verifyPayment } = require('../controllers/paymentController')

const router = express.Router()

router.use(protect)
router.get('/', getPaymentHistory)
router.post('/premium-order', createPremiumOrder)
router.post('/verify', verifyPayment)

module.exports = router
