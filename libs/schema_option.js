'use strict'

module.exports = (...args) => {

  const options = {}

  args.forEach(i => {

    switch(i) {

    case 'timestamps':
      options[i] = true
      break

    case 'versionKey':
      options[i] = false
      break

    case 'toJSON':
    case 'toObject':
      options[i] = {
        virtuals: true,
        transform: function(doc, ret, options) {
          delete ret.id
          delete ret.__v
      }}
      break

    }

  })

  return options

}
