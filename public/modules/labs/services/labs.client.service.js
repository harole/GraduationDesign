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
])
.factory('PrivateLabs', ['$resource',
  function($resource){
    return $resource('labs/info', {
      private: 1
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);