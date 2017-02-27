const mongoose   = require('mongoose')
const bcrypt     = require('bcryptjs')
const crypto     = require('crypto')
const User       = require('./schemas/user.schema')
const worker     = require('../worker')
mongoose.Promise = global.Promise

User.methods.generateOTP = function() {
  // TODO: make this short-lived - expire it
  this.code = crypto.randomBytes(6).toString('hex')
  return this.save()
}

User.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

User.methods.checkExisting = function(user) {
  if(user && user.verified) throw new Error('User already exists')
  return user
}

User.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

User.methods.updateFields = function(updates) {
  for (var i in updates) {
    switch (i) {

    case 'email':
      this[i] = updates[i]
      this.verified = false
      return this.generateOTP()
        .then(user => {
          // generate a verification code for user
          worker.now('email_verification', {
            email: user.email,
            code: user.code,
          })
        })
        .catch(err => {throw err})
      break

    case 'password':
      this[i] = this.generateHash(updates[i])
      break

    case 'code':
      throw new Error('Unauthorized')
      break

    default:
      this[i] = updates[i]

    }

  }
  return this.save()
}

User.statics.findByEmail = function(email) {
  if (email instanceof Array) {
    return this.find({email: {$in: email}}).exec()
  } else {
    return this.findOne({ email }).exec()
  }
}

module.exports = mongoose.model('User', User)
