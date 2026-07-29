const assert = require('assert')
const {
  generateTextWithProviders,
  setProviderImplementationsForTest,
} = require('./services/geminiService')

async function run() {
  setProviderImplementationsForTest({
    gemini: async () => {
      throw new Error('429 quota exceeded')
    },
    groq: async () => 'Groq fallback response',
  })

  const result = await generateTextWithProviders('Test prompt', 'provider fallback test')
  assert.strictEqual(result, 'Groq fallback response')
  console.log('AI provider fallback test passed: Gemini failure uses Groq.')
}

run().catch((error) => {
    console.error('AI provider fallback test failed:', error)
    process.exitCode = 1
  })
