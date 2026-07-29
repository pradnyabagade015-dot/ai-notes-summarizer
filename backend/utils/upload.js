const multer = require('multer')

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only PDF, DOCX, and TXT files are allowed'))
  }
}

const upload = multer({
  // Vercel functions have an ephemeral filesystem. Keeping the upload in memory
  // lets the controller extract its text before storing that text in MongoDB.
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter,
})

module.exports = upload
