'use strict';

// Articles controller
angular.module('labs')
.controller('LabsController', ['$scope', '$stateParams', '$location', 'Labs',
  function($scope, $stateParams, $location, Labs) {
    $scope.find = function(){
      $scope.labs = Labs.query();
    };
  }
]);