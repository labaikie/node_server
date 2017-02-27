'use strict'
const { User }      = require('../models')
const { signToken } = require('../libs/authentication')
const { validate }  = require('../libs/helpers')
const worker        = require('../worker')

function create(req, res, next) {
  const { email } = req.body

  User.findByEmail(email)

    .then(user => {
      // if a verified user exist, throw error
      if (user && user.verified) {throw new Error('User already exists')}
      // if no user, create new
      if (!user) {
        validate(email, 'email')
        user = new User({ email })
      }
      // generate new user.code
      return user.generateOTP()
    })

    .then(user => {
      req.data = {prompt: 'Check email for verification code'}
      next()
      // run a background job to send email with code
      worker.now('email_verification', {
        email: user.email,
        code: user.code,
      })
    })

    .catch(err => next(err))
}

function update(req, res, next) {
  const { _id } = req.user

  User.findById(_id).exec()

    .then(user => user.updateFields(req.body))

    .then(user => {
      const response = user ? {token: signToken(user, 30)} : `Verification code sent to user`
      req.data = req.data ? Object.assign({}, req.data, response) : response
      return next()
    })

    .catch(err => next(err))
}

module.exports = { create, update }
