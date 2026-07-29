const nodemailer = require('nodemailer')

const sendPasswordResetEmail = async ({ email, fullName, resetUrl }) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    throw new Error('Email service is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and EMAIL_FROM.')
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject: 'Reset your AI Notes Summarizer password',
    text: `Hello ${fullName},\n\nUse this link to reset your password. It expires in 15 minutes:\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.`,
  })
}

module.exports = { sendPasswordResetEmail }
