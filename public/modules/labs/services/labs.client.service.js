'use strict';

//Labs service used for communicating with the articles REST endpoints
angular.module('labs')
.factory('Labs', ['$resource',
  function($resource) {
    return $resource('labs/:labId', {
      labId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
])
.factory('PrivateLabs', ['$resource',
  function($resource){
    return $resource('labs/private/:labId', {
      labId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);