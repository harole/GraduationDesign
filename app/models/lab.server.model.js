'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Lab Schema
 */
var LabSchema = new Schema({
  department: {
    type: String,
    default: '',
    trim: true,
    required: 'Department cannot be blank'
  },
  floor: {
    type: Number,
    required: 'Floor cannot be blank'
  },
  lab_name: {
    type: String,
    default: '',
    trim: true,
    required: 'Floor cannot be blank'
  },
  person_num: {
    type: Number,
    default: ''
  }
});

mongoose.model('Lab', LabSchema);
