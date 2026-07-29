const Note = require('../models/Note')
const StudyPlan = require('../models/StudyPlan')

const formatPlan = (plan) => ({
  id: plan._id,
  noteId: plan.noteId,
  title: plan.title,
  scheduledFor: plan.scheduledFor,
  durationMinutes: plan.durationMinutes,
  completed: plan.completed,
  createdAt: plan.createdAt,
})

const createStudyPlan = async (req, res) => {
  try {
    const { title, scheduledFor, durationMinutes, noteId } = req.body
    const parsedDate = new Date(scheduledFor)

    if (!title?.trim() || Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: 'A title and valid study date are required' })
    }

    if (noteId) {
      const note = await Note.findOne({ _id: noteId, userId: req.user._id })
      if (!note) return res.status(404).json({ success: false, message: 'Selected note not found' })
    }

    const plan = await StudyPlan.create({
      userId: req.user._id,
      noteId: noteId || null,
      title: title.trim(),
      scheduledFor: parsedDate,
      durationMinutes: Number(durationMinutes) || 60,
    })

    res.status(201).json({ success: true, plan: formatPlan(plan) })
  } catch (error) {
    console.error('[createStudyPlan] Error:', error.message)
    res.status(500).json({ success: false, message: 'Failed to create study session' })
  }
}

const getStudyPlans = async (req, res) => {
  try {
    const plans = await StudyPlan.find({ userId: req.user._id }).sort({ scheduledFor: 1, createdAt: -1 })
    res.status(200).json({ success: true, plans: plans.map(formatPlan) })
  } catch (error) {
    console.error('[getStudyPlans] Error:', error.message)
    res.status(500).json({ success: false, message: 'Failed to fetch study plan' })
  }
}

const updateStudyPlan = async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, userId: req.user._id })
    if (!plan) return res.status(404).json({ success: false, message: 'Study session not found' })

    if (typeof req.body.completed !== 'boolean') {
      return res.status(400).json({ success: false, message: 'completed must be a boolean' })
    }

    plan.completed = req.body.completed
    await plan.save()
    res.status(200).json({ success: true, plan: formatPlan(plan) })
  } catch (error) {
    console.error('[updateStudyPlan] Error:', error.message)
    res.status(500).json({ success: false, message: 'Failed to update study session' })
  }
}

const deleteStudyPlan = async (req, res) => {
  try {
    const plan = await StudyPlan.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (!plan) return res.status(404).json({ success: false, message: 'Study session not found' })
    res.status(200).json({ success: true, message: 'Study session deleted' })
  } catch (error) {
    console.error('[deleteStudyPlan] Error:', error.message)
    res.status(500).json({ success: false, message: 'Failed to delete study session' })
  }
}

module.exports = { createStudyPlan, getStudyPlans, updateStudyPlan, deleteStudyPlan }
