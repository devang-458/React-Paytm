const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 10,
  MONGO_URL: process.env.MONGO_URL,
  NODE_ENV: process.env.NODE_ENV || 'development'
};