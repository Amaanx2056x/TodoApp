const mongoose = require('mongoose')
const Schema = mongoose.Schema
const TaskSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
    },
    completed: {
      type: Boolean,
      default: false
      }
    })
  module.exports = mongoose.model('tasks', TaskSchema)