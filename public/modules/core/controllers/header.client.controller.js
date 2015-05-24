'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
  function($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    if($scope.authentication.user){
      $scope.authentication.user.roles.forEach(function(role){
        if(role === 'admin') $scope.isAdmin = true;
        if(role === 'manager') $scope.isManager = true;
      });
    }
    $scope.toggleCollapsibleMenu = function() {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function() {
      $scope.isCollapsed = false;
    });
  }
]);