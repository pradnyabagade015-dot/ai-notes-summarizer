const Note = require('../models/Note')
const Summary = require('../models/Summary')
const Flashcard = require('../models/Flashcard')
const StudyPlan = require('../models/StudyPlan')
const SubscriptionPayment = require('../models/SubscriptionPayment')

const getOverview = async (req, res) => {
  try {
    const userId = req.user._id
    const [notes, summaries, flashcards, mcqResult, completedPlans, totalPlans, payments] = await Promise.all([
      Note.countDocuments({ userId }),
      Summary.countDocuments({ userId }),
      Flashcard.countDocuments({ userId }),
      Note.aggregate([{ $match: { userId } }, { $project: { count: { $size: { $ifNull: ['$mcqs', []] } } } }, { $group: { _id: null, total: { $sum: '$count' } } }]),
      StudyPlan.countDocuments({ userId, completed: true }),
      StudyPlan.countDocuments({ userId }),
      SubscriptionPayment.find({ userId }).sort({ createdAt: -1 }).limit(10).select('plan status amount currency providerTransactionId verifiedAt createdAt'),
    ])
    return res.status(200).json({
      success: true,
      profile: {
        user: req.user,
        stats: { notes, summaries, flashcards, mcqs: mcqResult[0]?.total || 0, completedPlans, totalPlans },
        payments,
      },
    })
  } catch (error) {
    console.error('[getOverview] Error:', error.message)
    return res.status(500).json({ success: false, message: 'Unable to load account analytics.' })
  }
}

module.exports = { getOverview }
