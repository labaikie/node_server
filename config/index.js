'use strict'

const environment = process.env.NODE_ENV
const port        = process.env.PORT || 8080
const appName     = process.env.APP_NAME || 'node_server'
const jobs        = process.env.JOB_TYPES
const mailer      = process.env.GMAIL
const mailerPw    = process.env.GMAIL_PW

let log, db

switch(environment) {
  case 'production':
    log = '[:date[iso]] :remote-addr - :remote-user :method :url HTTP/:http-version STATUS/:status :res[content-length] :referrer :user-agent'
    db = process.env.MONGODB_URI
    break
  case 'development':
    log = 'dev'
    db = process.env.MONGODB_URI
    break
  default: //local
    log = 'dev'
    db = `mongodb://localhost/${appName}`
}

module.exports = { db, log, port, appName, environment, jobs, mailer, mailerPw }
