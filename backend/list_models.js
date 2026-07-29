const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function listGenerativeModels() {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    console.error('Please set your GEMINI_API_KEY environment variable.');
    return;
  }

  const genAI = new GoogleGenerativeAI(API_KEY);

  try {
    console.log('The listModels function is not available in this version of the @google/generative-ai library.');
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listGenerativeModels();
