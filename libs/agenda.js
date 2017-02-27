'use strict'

const Agenda           = require('agenda')
const {
  jobs,
  db,
  environment
}                      = require('../config')
const agenda           = new Agenda({db: {address: db}})
const { JOB_SCHEDULE } = require('./constants')
const jobTypes         = environment != 'local' && jobs ? jobs.split(',') : []

jobTypes.forEach(type => require('./jobs/' + type)(agenda))

if(jobTypes.length) {
  agenda.on('ready', () => {
    // agenda.maxConcurrency()
    checkScheduled(jobs => {

      // log the number of jobs scheduled
      console.log(`♣ Recurring job count: ${jobs.length}`)

      // get the currently scheduled job names
      const jobNames = jobs.map(i => i.attrs.name)

      // check to see if all the jobs in the schedule are scheduled
      // if not scheduled, schedule
      for (var i in JOB_SCHEDULE) {
        if (!jobNames.includes(i)) {
          agenda.create(i).repeatAt(JOB_SCHEDULE[i]).save()
        }
      }
      // if(!jobs.length) agenda.every('10 seconds', 'JOB_NAME')
      agenda.start()
    })
  })
}

/*
check to see if there is any recurring algorithm background job existing
*/
function checkScheduled(callback) {
  agenda.jobs({name: {$in: Object.keys(JOB_SCHEDULE)}}, (err, jobs) => {
    if(err) console.log(`CHECK SCHEDULED JOBS ERROR: ${err}`)
    callback(jobs)
  })
}

function graceful() {
  agenda.cancel({repeatInterval: {$exists: true, $ne: null}}, (err, numRemoved) => {
    agenda.stop(() => process.exit(0))
  })
}

process.on('SIGTERM', graceful)
process.on('SIGINIT', graceful)
process.on('SIGBREAK', graceful)
process.on('SIGHUP', graceful)

module.exports = agenda
