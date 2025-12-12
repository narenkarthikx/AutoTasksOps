import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config();

// Export configuration
export default {
  PORT: process.env.PORT || 3001,
  DEMO_MOCK: process.env.DEMO_MOCK === 'true',
  GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY
};
