'use strict'

const ENVIRONMENT = process.env.NODE_ENV
const PORT        = process.env.PORT || 8080
const APPNAME     = process.env.APP_NAME || 'node_server'
const JOBS        = process.env.JOB_TYPES
const MAILER      = process.env.GMAIL
const MAILERPW    = process.env.GMAIL_PW
const CLIENT_URL  = process.env.CLIENT_URL

let LOG, DB

switch(ENVIRONMENT) {
  case 'production':
    LOG = '[:date[iso]] :remote-addr - :remote-user :method :url HTTP/:http-version STATUS/:status :res[content-length] :referrer :user-agent'
    DB = process.env.MONGODB_URI
    break
  case 'development':
    LOG = 'dev'
    DB = process.env.MONGODB_URI
    break
  default: //local
    LOG = 'dev'
    DB = `mongodb://localhost/${APPNAME}`
}

module.exports = { DB, LOG, PORT, APPNAME, ENVIRONMENT, JOBS, MAILER, MAILERPW, CLIENT_URL }
