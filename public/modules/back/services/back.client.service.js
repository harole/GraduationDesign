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
])
.factory('UploadExcel', ['$resource',
  function($resource){
    function transformRequestFunc(data){
      if(data === undefined) return data;
      var fd = new FormData();

      angular.forEach(data, function(value, key){
        if(value instanceof FileList){
          if (value.length === 1) {
            fd.append(key, value[0]);
          } else {
            angular.forEach(value, function(file, index) {
              fd.append(key + '_' + index, file);
            });
          }
        } else {
          console.log(key);
          console.log(value);
          fd.append(key, value);
        }
      });
      return fd;
    }
    return $resource('upload/excels/:excelId', {
      excelId: '@_id'
    }, {
      save: {
        method: 'POST',
        transformRequest: transformRequestFunc,
        headers:{'Content-Type': undefined},
        isArray: true
      }
    });
  }
])
.directive('file', function() {
    return {
        restrict: 'E',
        template: '<input type="file" />',
        replace: true,
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            var listener = function() {
                scope.$apply(function() {
                    attr.multiple ? ctrl.$setViewValue(element[0].files) : ctrl.$setViewValue(element[0].files[0]);
                });
            };
            element.bind('change', listener);
        }
    };
})
.directive('filesModel', function(){
  return {
    controller: function($parse, $element, $attrs, $scope){
      var exp = $parse($attrs.filesModel);

      $element.on('change', function(){
        exp.assign($scope, this.files);
        $scope.$apply();
      });
    }
  };
});