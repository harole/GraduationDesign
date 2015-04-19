'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  LabsInfo = mongoose.model('LabsInfo'),
  Lab = mongoose.model('Lab'),
  _ = require('lodash');

exports.create = function(req, res){
  var labInfo = new LabsInfo(req.body);

  // labInfo.findOne({lab: labInfo.lab}).exec(function(err, labInfo){

  // });
  labInfo.save(function(err){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else{
      res.json(labInfo);
    }
  });
};

exports.delete = function(req, res){
  var labInfo = req.lab;

  labInfo.remove(function(err){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else{
      res.json(labInfo);
    }
  });
};

exports.list = function(req, res){
  var queryParams = req.query;

  // ownerId 查询参数处理
  if(req.query.private){
    console.log(req.user.id);
    LabsInfo.find({user: req.user.id}).lean().exec(function(err, labsInfo){
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      else{
        var len = labsInfo.length,
          counter = 0;

        _.each(labsInfo, function(labInfo){
          Lab.findById(labInfo.lab).exec(function(err, lab){
            labInfo.lab = lab;
            if(++counter === len){
              res.send(labsInfo);
            }
          });
        });
      }
    });
    // return false;
  }
  else{
    console.log('queryParams');
    LabsInfo.find(queryParams).sort({'department': 1, 'floor': 1}).exec(function(err, labs){
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(labs);
      }
    });
  }

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
exports.hadExistLabInfo = function(req, res, next){
  LabsInfo.findOne({lab: req.body.lab, start_time: req.body.start_time}).exec(function(err, labInfo){
    console.log(labInfo);
    if(labInfo){
      return res.status(403).send({
        message: 'Lab had been reserved'
      });
    }
    next();
  });
};

exports.hasAuthorization = function(req, res, next){

  // if(req.lab.user !== req.user.id){
  //   return res.status(403).send({
  //     message: 'User is not authorized'
  //   });
  // }
  next();
};

exports.labByID = function(req, res, next, id){
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Lab is invalid'
    });
  }

  LabsInfo.findById(id).exec(function(err, lab) {
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
  var limitCondition = {user: req.user.id};

  LabsInfo.find(limitCondition).lean().exec(function(err, labsInfo){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var len = labsInfo.length,
        counter = 0;

      _.each(labsInfo, function(labInfo){
        Lab.findById(labInfo.lab).exec(function(err, lab){
          labInfo.lab = lab;
          if(++counter === len){
            res.send(labsInfo);
          }
        });
      });
    }
  });
};