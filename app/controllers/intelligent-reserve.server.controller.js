'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  fs = require('fs'),
  errorHandler = require('./errors.server.controller'),
  Lab = mongoose.model('Lab'),
  _ = require('lodash');

exports.create = function(req, res){
  // var path = '/upload/excels/'+req.body.name;
  // var data = fs.readFileSync(path, 'utf8');
  // console.log(data);
  // console.log(req);
  // console.log(req.body);

  // console.log(req.files);
};