'use strict';

// Articles controller
angular.module('labs')
.controller('LabsController', ['$scope', '$stateParams', '$location', 'Labs', 'Authentication',
  function($scope, $stateParams, $location, Labs, Authentication) {
    $scope.authentication = Authentication;

    $scope.department = '';
    $scope.floor = '';

    $scope.departments = [];
    $scope.floors = [];
    // 初始化实验室列表
    Labs.query()
    .$promise.then(function(labs){
      var departmentObj = {},
        floorObj = {};

      $scope.labs = labs;

      $scope.labs.forEach(function(lab, i){
        if(!departmentObj[lab.department]){
          departmentObj[lab.department] = true;
        }
        if(!floorObj[lab.floor]){
          floorObj[lab.floor] = true;
        }
      });
      // 获取 departments 和 floors
      $scope.departments = Object.keys(departmentObj);
      $scope.floors = Object.keys(floorObj);
    });

    $scope.changeDepartment = function(index){
      if(Object.prototype.toString.call(index) === '[object Number]'){
        $scope.department = $scope.departments[index];
      }
      else{
        $scope.department = '';
      }

    };
    $scope.changeFloor = function(index){
      if(Object.prototype.toString.call(index) === '[object Number]'){
        $scope.floor = $scope.floors[index];
      }
      else{
        $scope.floor = '';
      }
    };
    $scope.bookingLab = function(index){
      var lab = $scope.labs[index];

      lab.owner.id = $scope.authentication.user._id;
      lab.$update();
    };
  }
])
.controller('PrivateLabController', ['$scope', 'PrivateLabs',
  function($scope, PrivateLabs){
    $scope.labs = PrivateLabs.query();

    $scope.cancelLab = function(index){

      var lab = $scope.labs[index];
      lab.owner.id = '';
      lab.$update();
    };
  }
]);