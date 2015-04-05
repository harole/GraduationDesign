'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  labs = require('../../app/controllers/labs.server.controller');

module.exports = function(app) {
  app.route('/labs')
    .get(labs.list);

};
