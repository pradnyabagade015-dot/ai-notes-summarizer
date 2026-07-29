const errorHandler = (err, req, res, _next) => {
  console.error(err.stack)

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, message: 'File too large. Maximum size is 20MB.' })
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ success: false, message: 'Unexpected file field.' })
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  })
}

module.exports = errorHandler
