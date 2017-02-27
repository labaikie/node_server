'use strict'

const express           = require('express')
const mongoose          = require('mongoose')
const morgan            = require('morgan')
const app               = express()
const bodyParser        = require('body-parser')
const routes            = require('./config/routes')
const { db, log, port } = require('./config')

mongoose.Promise = global.Promise
mongoose.connect(db)

app.use(morgan(log))
app.use(require('cors')())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api', routes())

app.listen(port)
console.log(`listening on port:${port} ☻`)

module.exports = app
