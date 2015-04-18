'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Lab Schema
 */
var LabInfoSchema = new Schema({
  start_time: {
    type: Date,
    default: ''
  },
  end_time: {
    type: Date,
    default: ''
  },
  lab: {
    type: Schema.ObjectId,
    ref: 'Lab'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('LabsInfo', LabInfoSchema);
