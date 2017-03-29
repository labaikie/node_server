'use strict'
const { User }       = require('../models')
const { JWT_SECRET } = require('../config')
const jwt            = require('jsonwebtoken')

function checkToken(req, res, next) {
  const url = req._parsedUrl.pathname
  const checker = `${req.method}${url}`

  switch(checker) {

    // No auth check routes
    case 'GET/test':
    case 'POST/verify':
    case 'POST/authenticate':
    case 'GET/forgot-password':
    case 'POST/user':
      return next()

    // auth check
    default:
      const token = req.headers['x-access-token']

      if (!token) return next(new Error('Missing token'))

      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error('Invalid token'))
        req.user = decoded._doc
        return next()
      })
  }

}

function signToken(user, expiresIn = null) {
  if(expiresIn) {
    expiresIn = 3600 * expiresIn
    return jwt.sign(user, JWT_SECRET, { expiresIn })
  }
  return jwt.sign(user, JWT_SECRET)
}

function verify(req, res, next) {
  const { code, email } = req.body

  User.findByEmail(email)
    .then(user => {
      if (!user) {throw new Error('Wrong email')}

      if (user.code != code) {throw new Error('Invalid verification code')}

      user.verified = true
      user.code = null
      return user.save()
    })

    .then(user => {
      req.data = {token: signToken(user)}
      return next()
    })

    .catch(err => next(err))
}

function authenticate(req, res, next) {
  const { email, password } = req.body

  User.findByEmail(email)
    .then(user => {

      if (!user || !user.verified) {
        throw new Error('No such verified user')

      } else if(!user.validPassword(password)) {
        throw new Error('Wrong password')

      } else {
        req.data = {token: signToken(user)}
      }

      return next()
    })
    .catch(err => next(err))
}

function forgot(req, res, next) {
  const { email } = req.query

  User.findByEmail(email)
    .then(user => user.generateOTP())

    .then(user => {
      worker.now('reset_password', {
        email: user.email,
        code: user.code,
      })
      req.data = `Verification code sent to ${user.email}`
      return next()
    })

    .catch(err => next(new Error('Problem in generating verification code')))
}


module.exports = {
  checkToken,
  signToken,
  verify,
  authenticate,
  forgot
}
