'use strict';

//Labs service used for communicating with the articles REST endpoints
angular.module('back')
.factory('Labs', ['$resource',
  function($resource) {
    return $resource('back/labs/:labId', {
      labId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
])
.factory('Users', ['$resource',
  function($resource) {
    return $resource('back/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
])
.factory('LabsInfo', ['$resource',
  function($resource) {
    return $resource('labs/info/:labInfoId', {
      labInfoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);