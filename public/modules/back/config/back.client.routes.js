'use strict';

// Setting up route
angular.module('back', ['flow']).config(['$stateProvider',
  function($stateProvider) {
    // Articles state routing
    $stateProvider
    .state('back', {
      url: '/back',
      templateUrl: 'modules/back/views/back.client.view.html'
    })
    .state('back.labs', {
      url: '/labs',
      templateUrl: 'modules/back/views/labs.client.view.html'
    })
    .state('back.users', {
      url: '/users',
      templateUrl: 'modules/back/views/users.client.view.html'
    })
    .state('back.reserve', {
      url: '/reserve',
      templateUrl: 'modules/back/views/reserve.client.view.html'
    });
  }
]);