const mongoose = require('mongoose')

const studyPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', default: null },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    scheduledFor: { type: Date, required: true },
    durationMinutes: { type: Number, required: true, min: 15, max: 480, default: 60 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
)

module.exports = mongoose.model('StudyPlan', studyPlanSchema)
