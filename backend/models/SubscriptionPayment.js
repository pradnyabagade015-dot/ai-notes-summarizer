const mongoose = require('mongoose')

const subscriptionPaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ['premium'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'failed', 'refunded'],
      default: 'pending',
      required: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    providerTransactionId: {
      type: String,
      trim: true,
      maxlength: 255,
      default: undefined,
    },
    providerOrderId: {
      type: String,
      trim: true,
      maxlength: 255,
      default: undefined,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 3,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    failureReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
  },
  { timestamps: true },
)

subscriptionPaymentSchema.index(
  { provider: 1, providerTransactionId: 1 },
  {
    name: 'provider_transaction_id_unique_when_present',
    unique: true,
    partialFilterExpression: { providerTransactionId: { $type: 'string' } },
  },
)
subscriptionPaymentSchema.index(
  { provider: 1, providerOrderId: 1 },
  {
    name: 'provider_order_id_unique_when_present',
    unique: true,
    partialFilterExpression: { providerOrderId: { $type: 'string' } },
  },
)

module.exports = mongoose.model('SubscriptionPayment', subscriptionPaymentSchema)
