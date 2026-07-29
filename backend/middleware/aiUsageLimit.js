const User = require('../models/User')

const PLAN_LIMITS = {
  free: 10,
  premium: 100,
}

const getUsageDate = () => new Date().toISOString().slice(0, 10)
const getPlan = (plan) => (['premium', 'pro'].includes(plan) ? 'premium' : 'free')

const getCurrentUserPlan = async (userId) => {
  const user = await User.findById(userId).select('plan aiUsage')
  if (!user) return null

  const plan = getPlan(user.plan)
  if (user.plan !== plan) {
    await User.updateOne({ _id: user._id }, { $set: { plan } })
    user.plan = plan
  }
  return user
}

const checkAiUsageLimit = async (req, res, next) => {
  try {
    const today = getUsageDate()
    const currentUser = await getCurrentUserPlan(req.user._id)
    if (!currentUser) return res.status(401).json({ success: false, message: 'Not authorized, user not found' })

    const plan = currentUser.plan
    const limit = PLAN_LIMITS[plan]
    let updatedUser

    if (currentUser.aiUsage?.date !== today) {
      updatedUser = await User.findOneAndUpdate(
        { _id: currentUser._id, 'aiUsage.date': { $ne: today } },
        { $set: { plan, 'aiUsage.date': today, 'aiUsage.count': 1 } },
        { new: true },
      )
    }

    if (!updatedUser) {
      updatedUser = await User.findOneAndUpdate(
        { _id: currentUser._id, 'aiUsage.date': today, 'aiUsage.count': { $lt: limit } },
        { $set: { plan }, $inc: { 'aiUsage.count': 1 } },
        { new: true },
      )
    }

    if (!updatedUser) {
      const usage = await User.findById(currentUser._id).select('aiUsage')
      const used = usage?.aiUsage?.date === today ? usage.aiUsage.count : limit
      return res.status(429).json({
        success: false,
        message: `Your ${plan} plan has reached its daily AI request limit.`,
        usage: { plan, limit, used, remaining: 0 },
      })
    }

    req.aiUsage = {
      plan,
      limit,
      used: updatedUser.aiUsage.count,
      remaining: limit - updatedUser.aiUsage.count,
    }
    next()
  } catch (error) {
    console.error('[aiUsageLimit] Unable to record AI usage:', error.message)
    return res.status(500).json({ success: false, message: 'Unable to verify AI usage right now.' })
  }
}

const requirePremium = async (req, res, next) => {
  try {
    const currentUser = await getCurrentUserPlan(req.user._id)
    if (!currentUser) return res.status(401).json({ success: false, message: 'Not authorized, user not found' })
    if (currentUser.plan !== 'premium') {
      return res.status(403).json({ success: false, message: 'This feature requires a Premium plan.' })
    }
    next()
  } catch (error) {
    console.error('[requirePremium] Unable to verify plan:', error.message)
    return res.status(500).json({ success: false, message: 'Unable to verify plan access right now.' })
  }
}

module.exports = { checkAiUsageLimit, requirePremium, PLAN_LIMITS }
