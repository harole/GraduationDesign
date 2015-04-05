'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
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
  status: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Lab', ArticleSchema);
