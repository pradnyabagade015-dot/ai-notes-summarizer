const express = require('express')
const protect = require('../middleware/auth')
const {
  createStudyPlan,
  getStudyPlans,
  updateStudyPlan,
  deleteStudyPlan,
} = require('../controllers/studyPlanController')

const router = express.Router()

router.use(protect)
router.route('/').get(getStudyPlans).post(createStudyPlan)
router.route('/:id').patch(updateStudyPlan).delete(deleteStudyPlan)

module.exports = router
