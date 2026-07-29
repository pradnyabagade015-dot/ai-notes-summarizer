const path = require('path')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const paymentIndexDefinitions = [
  {
    key: { provider: 1, providerTransactionId: 1 },
    options: {
      name: 'provider_transaction_id_unique_when_present',
      unique: true,
      partialFilterExpression: { providerTransactionId: { $type: 'string' } },
    },
  },
  {
    key: { provider: 1, providerOrderId: 1 },
    options: {
      name: 'provider_order_id_unique_when_present',
      unique: true,
      partialFilterExpression: { providerOrderId: { $type: 'string' } },
    },
  },
]

const hasSameKey = (first, second) => JSON.stringify(first) === JSON.stringify(second)

const migratePaymentIndexes = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Add it to backend/.env before running this migration.')
  }

  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  const collection = mongoose.connection.collection('subscriptionpayments')
  const currentIndexes = await collection.indexes()

  for (const definition of paymentIndexDefinitions) {
    const matchingIndexes = currentIndexes.filter((index) => hasSameKey(index.key, definition.key))
    for (const index of matchingIndexes) {
      await collection.dropIndex(index.name)
      console.log(`Dropped payment index: ${index.name}`)
    }
    await collection.createIndex(definition.key, definition.options)
    console.log(`Created payment index: ${definition.options.name}`)
  }
}

migratePaymentIndexes()
  .then(() => mongoose.disconnect())
  .catch(async (error) => {
    console.error('Payment index migration failed:', error.message)
    await mongoose.disconnect().catch(() => {})
    process.exitCode = 1
  })
