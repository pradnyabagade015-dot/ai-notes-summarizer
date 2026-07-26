const getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'AI Notes Summarizer Backend Running',
  })
}

module.exports = { getHealth }
