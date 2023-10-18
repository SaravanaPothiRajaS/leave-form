

const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vinodhkumaryin@gmail.com',
    pass: process.env.GMAIL_PASSWORD,
  },
});

module.exports = transporter;
