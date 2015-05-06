'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  labs = require('../../app/controllers/labs.server.controller');

module.exports = function(app) {
  app.route('/labs')
    .post(users.requiresLogin, labs.create)
    .get(labs.list);

  // app.route('/labs/private/:labId')
  //   .put(users.requiresLogin, labs.hasAuthorization, labs.update);

  app.route('/labs/:labId')
    .get(labs.read)
    .put(users.requiresLogin, labs.update)
    .delete(users.requiresLogin, labs.delete);

  app.param('labId', labs.labByID);
};
