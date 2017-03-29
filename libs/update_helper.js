'use strict'

const mongoose                   = require('mongoose')
const { validate, pushOrSplice } = require('./helpers')
const worker                     = require('../worker')

module.exports = (doc, updates) => {

  for (var i in updates) {

    switch (i) {

    /* Ignored Cases */
    case 'code':
    case '_id':
    case 'verified':
    case 'fullName':
      break

    /* User Update Cases */
    case 'email':
      validate(updates[i], i)
      doc[i] = updates[i]
      doc.verified = false
      return doc.generateOTP()
        .then(user => {
          // generate a verification code for user
          worker.now('send_email', {
            email: user.email,
            code: user.code,
            type: 'email_verification',
          })
        })
        .catch(err => {throw err})

    case 'password':
      doc[i] = doc.generateHash(updates[i])
      break

    case 'firstName':
      doc[i] = updates[i].toLowerCase()
      break

    case 'lastName':
      doc[i] = updates[i].toLowerCase()
      break

    case 'phone':
      validate(updates[i], i)
      doc[i] = updates[i]
      break

    case 'organization':
      doc[i] = updates[i]
      break

    /* Role Update Cases */
    case 'cardsDisplay':
      // if just one card, check if the card is already in the array
      // and push or splice
      if (updates[i].length  === 1) {
        doc[i] = pushOrSplice(doc[i], updates[i][0])

      // if more than one card just replace the array
      } else {
        doc[i] = updates[i]
      }
      break

    default:
      doc[i] = updates[i]

    }
  }

  return doc.save()

}
