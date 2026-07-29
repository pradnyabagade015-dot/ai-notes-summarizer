const path = require('path')
const fs = require('fs')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const request = require('supertest')

async function main() {
  const mongod = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongod.getUri()
  process.env.JWT_SECRET = 'test-secret'

  const app = require('./server')
  const User = require('./models/User')
  const Note = require('./models/Note')

  await mongoose.disconnect().catch(() => {})
  await mongoose.connect(process.env.MONGODB_URI)

  const user = await User.create({
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'hashed-password',
  })

  const jwt = require('jsonwebtoken')
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

  const sampleFilePath = path.join(__dirname, 'uploads', 'sample.txt')
  fs.writeFileSync(sampleFilePath, 'hello world')

  const response = await request(app)
    .post('/api/notes/upload')
    .set('Authorization', `Bearer ${token}`)
    .attach('file', sampleFilePath, { filename: 'sample.txt', contentType: 'text/plain' })

  console.log('STATUS', response.status)
  console.log(JSON.stringify(response.body, null, 2))

  const noteCount = await Note.countDocuments()
  console.log('NOTE_COUNT', noteCount)

  await mongoose.disconnect()
  await mongod.stop()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
