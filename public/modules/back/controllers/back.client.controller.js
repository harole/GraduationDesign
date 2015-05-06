'use strict';

angular.module('back')
.controller('BackManageController', ['$scope',
  function($scope){
    $scope.state = false;
  }
])
.controller('LabsMgtController', ['$scope', 'Labs', 'LabsInfo',
  function($scope, Labs, LabsInfo){
    Labs.query().$promise.then(function(labs){
      $scope.labs = labs;
      $scope.totalLabs = labs.length;

      $scope.labsCurrentPage = 1;
      $scope.labsPerPage = 10;

      $scope.pageChanged = function() {
        var startIndex = ($scope.labsCurrentPage-1)*10;
        var endIndex = startIndex + $scope.labsPerPage;

        $scope.currentLabs = $scope.labs.slice(startIndex, endIndex);
      };
      $scope.pageChanged();
    });

    $scope.newLabs = [];
    $scope.labsInfoUrl = 'modules/labs/views/labs-info.client.view.html';
    $scope.removeLab = function(index){
      var lab = $scope.labs[index];
      lab.$remove(function(){
        LabsInfo.query({lab: lab._id}).$promise.then(function(labsInfo){
          if(labsInfo.length){
            labsInfo.forEach(function(labInfo){
              labInfo.$remove();
            });
          }
        });
      });

    };
    $scope.addLab = function(){
      var labObj = new Labs({
        department: '',
        floor: '',
        lab_name: '',
        person_num: ''
      });
      $scope.newLabs.unshift(labObj);
    };
    $scope.submitNewLab = function(index){
      var newLab = $scope.newLabs[index];

      newLab.$save(function(){
        $scope.newLabs.splice(index, 1);
        $scope.labs.unshift(newLab);
      });
    };
  }
])
.controller('UsersMgtController', ['$scope', 'Users',
  function($scope, Users){

    Users.query().$promise.then(function(users){
      $scope.users = users;
      $scope.users.forEach(function(user, index){
        user.primaryIndex = index;
        console.log(user);
      });
    });
    $scope.setManager = function(index){
      var user = $scope.users[index];
      user.roles.push('manager');
      // user.primaryIndex = index;

      user.$update(function(){
        user.primaryIndex = index;
      });
    };
    $scope.removeManager = function(index){
      var user = $scope.users[index];
      console.log(index);
      console.log($scope.users);
      user.roles.forEach(function(role, index){
        if(role === 'manager'){
          user.roles.splice(index, 1);
        }
      });
      // console.log(user);
      // user.primaryIndex = index;
      user.$update(function(){
        user.primaryIndex = index;
      });
    };
  }
])
.filter('userRoles', [
  function(){
    return function(inputArr, str, bool){
      if(inputArr){
        return inputArr.filter(function(inputItem){
          if(!bool && inputItem.roles.indexOf(str) !== -1){
            return true;
          }
          if(bool && inputItem.roles.indexOf(str) === -1){
            return true;
          }
        });
      }
    };
  }
]);