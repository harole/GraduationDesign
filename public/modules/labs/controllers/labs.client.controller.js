'use strict';

// Articles controller
angular.module('labs')
.controller('LabsController', ['$scope', '$stateParams', '$location', 'Labs', 'Authentication', 'LabsInfo',
  function($scope, $stateParams, $location, Labs, Authentication, LabsInfo) {
    // var labsResource;

    $scope.authentication = Authentication;
    $scope.onlyEnabledLab = false;

    $scope.department = null;
    $scope.floor = null;
    $scope.lab_name = null;
    $scope.owner = {
      id: null
    };

    $scope.departments = [];
    $scope.floors = [];

    function queryLabs(params){
      Labs.query(params).$promise.then(function(labs){
        var departmentObj = {},
          floorObj = {};

        $scope.labs = labs.slice(0,5);

        $scope.labs.forEach(function(lab, i){
          if(!departmentObj[lab.department]){
            departmentObj[lab.department] = true;
          }
          if(!floorObj[lab.floor]){
            floorObj[lab.floor] = true;
          }
          lab.dt = new Date();
          lab.opened = false;
          lab.periods = [{
            startTime: '8:30',
            endTime: '10:05'
          }, {
            startTime: '10:20',
            endTime: '11:55'
          }, {
            startTime: '14:30',
            endTime: '16:05'
          }, {
            startTime: '16:20',
            endTime: '17:55'
          }, {
            startTime: '19:30',
            endTime: '21:55'
          }];
          lab.selectedPeriod = lab.periods[0];
        });
        // 获取 departments 和 floors
        $scope.departments = Object.keys(departmentObj);
        $scope.floors = Object.keys(floorObj);

      });
    }

    // 初始化实验室列表
    queryLabs();

    $scope.$watch('onlyEnabledLab', function(newVal, oldVal){
      if(newVal !== oldVal){
        $scope.submit();
      }
    });
    $scope.$watch('department', function(newVal, oldVal){
      if(newVal !== oldVal){
        $scope.submit();
      }
    });
    $scope.$watch('floor', function(newVal, oldVal){
      if(newVal !== oldVal){
        $scope.submit();
      }
    });
    $scope.changeDepartment = function(index){
      if(Object.prototype.toString.call(index) === '[object Number]'){
        $scope.department = $scope.departments[index];
      }
      else{
        $scope.department = null;
      }
    };
    $scope.changeFloor = function(index){
      if(Object.prototype.toString.call(index) === '[object Number]'){
        $scope.floor = $scope.floors[index];
      }
      else{
        $scope.floor = null;
      }
    };
    $scope.bookingLab = function(index){
      var lab = $scope.labs[index],
        year = lab.dt.getFullYear(),
        month = lab.dt.getMonth()+ 1,
        day = lab.dt.getDate(),
        date = year + '-' + month + '-' + day;

      var startTime =  date + ' ' + lab.selectedPeriod.startTime;
      var endTime = date + ' ' + lab.selectedPeriod.endTime;

      var labInfo = new LabsInfo({
        start_time: new Date(startTime),
        end_time: new Date(endTime),
        lab: lab._id,
        user: $scope.authentication.user._id
      });

      // lab.owner.id = $scope.authentication.user._id;
      labInfo.$save(function(response){

      }, function(errorResponse){
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.submit = function(){
      var queryParams ={};
      if($scope.department !== null){
        queryParams.department = $scope.department;
      }
      if($scope.floor !== null){
        queryParams.floor = $scope.floor;
      }
      if($scope.lab_name !== null){
        queryParams.lab_name = $scope.lab_name;
      }
      if($scope.onlyEnabledLab){
        queryParams.ownerId = '';
      }
      queryLabs(queryParams);
    };

    // 日期控件
    $scope.open = function($event, index) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.labs[index].opened = true;
    };
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    $scope.minDate = new Date();

    // 时间下拉
    $scope.selectPeriod = function(labIndex, periodIndex){
      if($scope.labs[labIndex].periods[periodIndex]){
        $scope.labs[labIndex].selectedPeriod = $scope.labs[labIndex].periods[periodIndex];
      }
    };
  }
])
.controller('PrivateLabController', ['$scope', 'LabsInfo', 'Authentication', '$stateParams',
  function($scope, LabsInfo, Authentication, $stateParams){
    var authentication = Authentication;
    console.log($stateParams);
    LabsInfo.query($stateParams).$promise.then(function(labsInfo){
      $scope.labsInfo = labsInfo;
    }, function(){

    });

    $scope.remove = function(index){
      var labInfo = $scope.labsInfo.splice(index, 1)[0];
      labInfo.lab = labInfo.lab._id;
      console.log(labInfo);
      labInfo.$remove();
    };


  }
]);