'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  labs = require('../../app/controllers/labs.server.controller'),
  labsInfo = require('../../app/controllers/labs-info.server.controller');

module.exports = function(app) {

  app.route('/labs/info')
    .post(users.requiresLogin, labsInfo.hadExistLabInfo, labsInfo.create)
    .get(labsInfo.list);
    // .put(users.requiresLogin, labsInfo.update);

  app.route('/labs/info/:labsInfoId')
    .delete(users.requiresLogin, labsInfo.hasAuthorization, labsInfo.delete);

  // app.route('/labs/info?private=1')
  //   .get(labsInfo.privateList);

  // app.route('/labs/info/private:labsInfoId')
  //   .delete(users.requiresLogin, labsInfo.hasAuthorization, labsInfo.delete);

  app.param('labsInfoId', labsInfo.labByID);
};
