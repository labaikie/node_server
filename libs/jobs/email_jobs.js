'use strict'
const nodemailer = require('nodemailer')
const {
  mailer,
  mailerPw,
  appName
}                = require('../../config')

/*configure transporter*/
const transporter = nodemailer.createTransport(`smtps://${mailer}%40gmail.com:${mailerPw}@smtp.gmail.com`)

module.exports = (agenda) => {
  /*
  send to verify user's email
  */
  agenda.define('email_verification', (job, done) => {
    const { email, code } = job.attrs.data

    // email verificaiton
    sendEmail(email, code)

      // log success
      .then(data => {
        console.log(`JOB ID ${job.attrs._id}: SUCCESS`)
        console.log(`EMAILED VERIFICATION CODE TO ${email}`)
        done()
      })

      // log error
      .catch(err => {
        console.log(`JOB ID ${job.attrs._id}: FAILED`)
        done(err)
      })
  })
}

function sendEmail(email, code) {
  const mailOptions = {
    from: `${appName} <${mailer}@gmail.com>`,
    to: email,
    subject: `Please verify your email`,
    text: 'Please click the link to verify your email',
    html: `<b>Please click <a href="${process.env.CLIENT_URL}/verify/${code}">here</a> to verify your email.</b>`
  }

  return transporter.sendMail(mailOptions)
}
