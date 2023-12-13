

const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  // host: 'smtp.office365.com',
  service: "Outlook365",
  port: 587,
  auth: {
    user:process.env.MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

module.exports = transporter;

 

// const nodemailer = require('nodemailer');


// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'vinodhkumaryin@gmail.com',
//     pass: 'wdoc ssfe mwzy kdhe',
//   },
// });

// module.exports = transporter;
