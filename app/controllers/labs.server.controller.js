'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Lab = mongoose.model('Lab'),
  _ = require('lodash');

exports.list = function(req, res){
  Lab.find().exec(function(err, labs){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(labs);
    }
  });
};
