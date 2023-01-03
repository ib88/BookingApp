// config.js
const dotenv = require("dotenv");

dotenv.config();
// Export env variables
module.exports = {
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  PORT: process.env.PORT,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY

};
