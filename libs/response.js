'use strict'
const serialize = require('./serializer')

/*
return status code based on error message
*/
const getStatusCode = (message) => {
  switch(message) {
    case 'Unauthorized':
    case 'Wrong password':
      return 401
    case 'Forbidden':
    case 'Missing token':
    case 'Invalid token':
    case 'Invalid verification code':
      return 403
    case 'Invalid string format':
      return 406
    case 'User already exists':
      return 422
    default:
      return 400
  }
}

/*
build & return error to client
*/
const handleError = (err, req, res, next) => {
  console.log('error', err)
  const error = err.message
  return res.status(getStatusCode(error)).send({ error })
}

/*
build & return successful response data to client
*/
const handleSuccess = (req, res) => {
  let { data } = req
  data = serialize(data)
  return res.status(200).send({ data })
}

module.exports = { handleSuccess, handleError }
