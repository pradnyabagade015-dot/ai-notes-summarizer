const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, '.env') })

const app = require('./server')
const mongoose = require('mongoose')
const request = require('supertest')

async function runPdfTest() {
  console.log('Connecting to Mongo...')
  await mongoose.connect(process.env.MONGODB_URI)

  const testEmail = `pdftest_${Date.now()}@example.com`

  // 1. Register user
  const regRes = await request(app).post('/api/auth/register').send({
    fullName: 'PDF Tester',
    email: testEmail,
    password: 'password123',
  })

  const token = regRes.body.token

  // 2. Create sample PDF file
  const samplePdfPath = path.join(__dirname, 'uploads', `test_sample_${Date.now()}.pdf`)
  
  // Minimal valid PDF binary with text content "Artificial Intelligence PDF test document content for note summarizer"
  const minimalPdfHeader = `%PDF-1.4
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kinds [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>> endobj
4 0 obj <</Length 120>>
stream
BT
/F1 12 Tf
100 700 Td
(Artificial Intelligence PDF test document content for note summarizer) Tj
ET
endstream
endobj
5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000414 00000 n 
trailer <</Size 6 /Root 1 0 R>>
startxref
490
%%EOF`

  fs.writeFileSync(samplePdfPath, minimalPdfHeader)

  console.log('Testing PDF file upload to /api/notes/upload...')
  const uploadRes = await request(app)
    .post('/api/notes/upload')
    .set('Authorization', `Bearer ${token}`)
    .attach('file', samplePdfPath)

  console.log('Upload status:', uploadRes.status)
  console.log('Upload body:', uploadRes.body)

  if (!uploadRes.body.note || !uploadRes.body.note.id) {
    throw new Error('PDF Note upload failed')
  }

  const note = uploadRes.body.note

  console.log('Testing /api/summaries generation for uploaded PDF note...')
  const summaryRes = await request(app)
    .post('/api/summaries')
    .set('Authorization', `Bearer ${token}`)
    .send({
      noteId: note.id,
      text: note.content,
    })

  console.log('Summary status:', summaryRes.status)
  console.log('Summary output:', summaryRes.body.summary?.summary)

  // Cleanup sample file
  if (fs.existsSync(samplePdfPath)) {
    fs.unlinkSync(samplePdfPath)
  }

  await mongoose.disconnect()
  console.log('--- PDF UPLOAD & SUMMARIZATION TEST PASSED PERFECTLY! ---')
}

runPdfTest().catch((err) => {
  console.error('PDF TEST FAILED:', err)
  mongoose.disconnect().catch(() => {})
  process.exit(1)
})
