'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  labs = require('../../app/controllers/labs.server.controller');

module.exports = function(app) {
  app.route('/labs')
    .get(labs.list);

  app.route('/labs/private')
    .get(labs.privateList);

  app.route('/labs/private/:labId')
    .put(users.requiresLogin, labs.hasAuthorization, labs.update);

  app.route('/labs/:labId')
    .get(labs.read)
    .put(users.requiresLogin, labs.update);

  app.param('labId', labs.labByID);
};
