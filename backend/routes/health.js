const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'AI Notes Summarizer Backend Running',
  })
})

module.exports = router
