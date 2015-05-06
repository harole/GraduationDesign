'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Lab = mongoose.model('Lab'),
  _ = require('lodash');

exports.create = function(req, res){
  var lab = new Lab(req.body);
  console.log(lab);
  lab.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(lab);
    }
  });
};

exports.list = function(req, res){
  var queryParams = req.query;

  Lab.find(queryParams).sort({'department': 1, 'floor': 1, 'lab_name': 1}).exec(function(err, labs){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(labs);
    }
  });
};

exports.read = function(req, res){
  res.json(req.lab);
};

exports.update = function(req, res){
  var lab = req.lab;
  lab = _.extend(lab, req.body);
  lab.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(lab);
    }
  });
};

exports.delete = function(req, res){
  var lab = req.lab;

  lab.remove(function(err){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else{
      res.json(lab);
    }
  });
};

exports.hasAuthorization = function(req, res, next){
  if(req.lab.owner.id !== req.user.id){
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};

exports.labByID = function(req, res, next, id){
  console.log(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Lab is invalid'
    });
  }

  Lab.findById(id).exec(function(err, lab) {
    if (err) return next(err);
    if (!lab) {
      return res.status(404).send({
        message: 'Lab not found'
      });
    }
    req.lab = lab;
    next();
  });
};

// private Labs
exports.privateList = function(req, res){
  var limitCondition = {owner:{id:req.user._id.toString()}};

  Lab.find(limitCondition).exec(function(err, labs){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log(labs);
      res.json(labs);
    }
  });
// 55006ae6a3af85a817d57f66
};