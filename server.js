'use strict'

const express           = require('express')
const mongoose          = require('mongoose')
const morgan            = require('morgan')
const app               = express()
const bodyParser        = require('body-parser')
const routes            = require('./config/routes')
const { DB, LOG, PORT } = require('./config')

mongoose.Promise = global.Promise
mongoose.connect(DB)

app.use(morgan(LOG))
app.use(require('cors')())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api', routes())

app.listen(PORT)
console.log(`listening on port:${PORT} ☻`)

module.exports = app
