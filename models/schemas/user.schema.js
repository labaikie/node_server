'use strict'

const mongoose     = require('mongoose')
const schemaOption = require('../../libs/schema_option')

const UserSchema = {
  email:          {type: String, required: true, unique: true, maxlength: 254, index: true},
  password:       {type: String, maxlength: 254},
  verified:       {type: Boolean, default: false},
  phone:          {type: String, maxlength: 16},
  firstName:      {type: String, maxlength: 64},
  lastName:       {type: String, maxlength: 64},
  goal:           {type: Number, default: 1},
  goalType:       {type: Number, default: 0}, // see constants.GOAL_TYPES
  code:           {type: String},
  deviceToken:    {type: String},
  noticeOff:      {type: Boolean, default: false},
  emailOff:       {type: Boolean, default: false},
}

module.exports = new mongoose.Schema(
  UserSchema,
  schemaOption('timestamps', 'versionKey')
)
