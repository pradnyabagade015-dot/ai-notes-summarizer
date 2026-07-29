const crypto = require('crypto')
const mongoose = require('mongoose')
const Razorpay = require('razorpay')
const SubscriptionPayment = require('../models/SubscriptionPayment')
const User = require('../models/User')

const formatPayment = (payment) => ({
  id: payment._id,
  plan: payment.plan,
  status: payment.status,
  provider: payment.provider,
  providerOrderId: payment.providerOrderId,
  providerTransactionId: payment.providerTransactionId,
  amount: payment.amount,
  currency: payment.currency,
  verifiedAt: payment.verifiedAt,
  createdAt: payment.createdAt,
})

const getRazorpayConfig = () => {
  if (process.env.PAYMENT_GATEWAY_ENABLED !== 'true') {
    const error = new Error('Razorpay payments are not enabled.')
    error.statusCode = 503
    throw error
  }

  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  const amount = Number(process.env.RAZORPAY_PREMIUM_AMOUNT_PAISE)
  const currency = (process.env.RAZORPAY_CURRENCY || 'INR').toUpperCase()

  if (!keyId || !keySecret || !Number.isSafeInteger(amount) || amount <= 0 || !/^[A-Z]{3}$/.test(currency)) {
    const error = new Error('Razorpay payment configuration is incomplete.')
    error.statusCode = 503
    throw error
  }

  return { keyId, keySecret, amount, currency }
}

const activatePremiumPlan = async (userId, payment) => {
  const user = await User.findById(userId)
  if (!user) {
    const error = new Error('Not authorized, user not found')
    error.statusCode = 401
    throw error
  }

  user.plan = 'premium'
  if (!user.premiumActivatedAt) user.premiumActivatedAt = payment.verifiedAt || new Date()
  user.subscriptionPaymentId = payment._id
  await user.save()
  return user
}

const getPaymentHistory = async (req, res) => {
  try {
    const payments = await SubscriptionPayment.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('plan status provider providerOrderId providerTransactionId amount currency verifiedAt createdAt')

    res.status(200).json({ success: true, payments: payments.map(formatPayment) })
  } catch (error) {
    console.error('[getPaymentHistory] Error:', error.message)
    res.status(500).json({ success: false, message: 'Unable to load payment history.' })
  }
}

const createPremiumOrder = async (req, res) => {
  let payment
  try {
    if (req.user.plan === 'premium') {
      return res.status(409).json({ success: false, message: 'Your Premium plan is already active.' })
    }

    const { keyId, keySecret, amount, currency } = getRazorpayConfig()
    payment = await SubscriptionPayment.create({
      userId: req.user._id,
      plan: 'premium',
      status: 'pending',
      provider: 'razorpay',
      amount,
      currency,
    })

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `premium_${payment._id.toString()}`,
      notes: { paymentAttemptId: payment._id.toString(), userId: req.user._id.toString(), plan: 'premium' },
    })

    payment.providerOrderId = order.id
    await payment.save()

    return res.status(201).json({
      success: true,
      order: {
        paymentAttemptId: payment._id,
        orderId: order.id,
        keyId,
        amount: order.amount,
        currency: order.currency,
      },
    })
  } catch (error) {
    if (payment) {
      payment.status = 'failed'
      payment.failureReason = 'Unable to create Razorpay order.'
      await payment.save().catch(() => {})
    }
    console.error('[createPremiumOrder] Error:', error.message)
    // A Razorpay API error can itself use HTTP 401 for invalid gateway
    // credentials. It is not an authentication failure of our logged-in user;
    // returning it as 401 makes the frontend clear a valid app session.
    const isConfigurationError = error.statusCode === 503
    return res.status(isConfigurationError ? 503 : 502).json({
      success: false,
      message: isConfigurationError ? error.message : 'Unable to create a Razorpay payment order. Please verify the Test Mode key pair.',
    })
  }
}

const verifyPayment = async (req, res) => {
  try {
    const paymentAttemptId = req.body?.paymentAttemptId?.trim()
    const razorpayPaymentId = req.body?.razorpayPaymentId?.trim()
    const razorpaySignature = req.body?.razorpaySignature?.trim()

    if (!mongoose.isValidObjectId(paymentAttemptId) || !razorpayPaymentId || razorpayPaymentId.length > 255 || !/^[a-f0-9]{64}$/i.test(razorpaySignature || '')) {
      return res.status(400).json({ success: false, message: 'Valid Razorpay payment details are required.' })
    }

    const { keySecret } = getRazorpayConfig()
    const payment = await SubscriptionPayment.findOne({
      _id: paymentAttemptId,
      userId: req.user._id,
      provider: 'razorpay',
      status: { $in: ['pending', 'verified'] },
    })
    if (!payment?.providerOrderId) {
      return res.status(404).json({ success: false, message: 'Pending payment attempt not found.' })
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${payment.providerOrderId}|${razorpayPaymentId}`)
      .digest('hex')
    const signatureIsValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf8'),
      Buffer.from(razorpaySignature, 'utf8'),
    )
    if (!signatureIsValid) {
      return res.status(400).json({ success: false, message: 'Payment signature verification failed.' })
    }

    if (payment.status === 'verified' && payment.providerTransactionId !== razorpayPaymentId) {
      return res.status(409).json({ success: false, message: 'This payment attempt has already been processed.' })
    }

    const verifiedPayment = payment.status === 'verified'
      ? payment
      : await SubscriptionPayment.findOneAndUpdate(
        { _id: payment._id, userId: req.user._id, status: 'pending' },
        { $set: { status: 'verified', providerTransactionId: razorpayPaymentId, verifiedAt: new Date() } },
        { new: true, runValidators: true },
      )
    if (!verifiedPayment) {
      return res.status(409).json({ success: false, message: 'This payment attempt has already been processed.' })
    }

    const user = await activatePremiumPlan(req.user._id, verifiedPayment)
    return res.status(200).json({
      success: true,
      payment: formatPayment(verifiedPayment),
      planUpdated: true,
      user: { plan: user.plan, premiumActivatedAt: user.premiumActivatedAt },
    })
  } catch (error) {
    console.error('[verifyPayment] Error:', error.message)
    return res.status(error.statusCode || 500).json({ success: false, message: error.statusCode ? error.message : 'Unable to verify payment.' })
  }
}

module.exports = { createPremiumOrder, getPaymentHistory, verifyPayment }
