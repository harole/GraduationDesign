'use strict';

// Articles controller
angular.module('labs')
.controller('LabsController', ['$scope', '$stateParams', '$location', 'Labs', 'Authentication', 'LabsInfo', '$timeout',
  function($scope, $stateParams, $location, Labs, Authentication, LabsInfo, $timeout) {
    var timer = 2500,
      Periods = [{
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

    $scope.authentication = Authentication;
    // $scope.onlyEnabledLab = false;
    $scope.department = null;
    $scope.floor = null;
    $scope.lab_name = null;

    $scope.departments = [];
    $scope.floors = [];

    // 修改日期时，改变可预订的时间段
    $scope.changedDate = function(index){
      var lab = $scope.labs[index],
        periods = Periods.slice(),
        year = lab.dt.getFullYear(),
        month = lab.dt.getMonth()+ 1,
        day = lab.dt.getDate(),
        date = year + '-' + month + '-' + day;
      $scope.labsInfo.forEach(function(labInfo, i){
        if(labInfo.lab._id === lab._id){
          periods = periods.filter(function(period){
            if(new Date(labInfo.start_time).getTime() === new Date(date+' '+period.startTime).getTime()){
              return false;
            }
            return true;
          });
        }
      });
      lab.periods = periods;
      lab.selectedPeriod = lab.periods[0];
    };
    // 查找labs
    function queryLabs(params){
      Labs.query(params).$promise.then(function(labs){
        var departmentObj = {},
          floorObj = {};

        $scope.labs = labs;
        LabsInfo.query().$promise.then(function(labsInfo){
          $scope.labsInfo = labsInfo;

          // 添加时间段
          $scope.labs.forEach(function(lab, i){
            var periods = Periods.slice();

            if(!departmentObj[lab.department]){
              departmentObj[lab.department] = true;
            }
            if(!floorObj[lab.floor]){
              floorObj[lab.floor] = true;
            }
            lab.dt = new Date();
            var year = lab.dt.getFullYear(),
                month = lab.dt.getMonth()+ 1,
                day = lab.dt.getDate(),
                date = year + '-' + month + '-' + day;
            // 从 labsInfo 中过滤掉已经预订的时段
            $scope.labsInfo.forEach(function(labInfo, i){
              if(labInfo.lab._id === lab._id){
                periods = periods.filter(function(period){
                  if(new Date(labInfo.start_time).getTime() === new Date(date+' '+period.startTime).getTime()){
                    return false;
                  }
                  return true;
                });
              }
            });

            lab.opened = false;
            lab.reserveInterval = 1;
            lab.reserveTimes = 1;
            lab.periods = periods;
            lab.selectedPeriod = lab.periods[0];
          });
        });

        // pagination
        $scope.totalLabs = labs.length;

        $scope.labsCurrentPage = 1;
        $scope.labsPerPage = 10;

        $scope.pageChanged = function() {
          var startIndex = ($scope.labsCurrentPage-1)*10;
          var endIndex = startIndex + $scope.labsPerPage;

          $scope.currentLabs = $scope.labs.slice(startIndex, endIndex);
        };
        $scope.pageChanged();

        // 获取 departments 和 floors
        $scope.departments = Object.keys(departmentObj);
        $scope.floors = Object.keys(floorObj);
      });
    }

    // 初始化实验室列表
    queryLabs();

    // $scope.$watch('onlyEnabledLab', function(newVal, oldVal){
    //   if(newVal !== oldVal){
    //     $scope.submit();
    //   }
    // });
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
    $scope.$watch('error', function(newVal, oldVal){
      if(newVal !== oldVal && newVal){
        $timeout(function(){
          $scope.error = false;
        }, timer);
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
        date = year + '-' + month + '-' + day,
        labsInfo = [];

      var startTime =  new Date(date + ' ' + lab.selectedPeriod.startTime).getTime();
      var endTime = new Date(date + ' ' + lab.selectedPeriod.endTime).getTime();

      if(lab.reserveTimes && lab.reserveInterval){
        var intervalMillisecond = lab.reserveInterval*24*60*60*1000;

        for(var i = 0; i < lab.reserveTimes; i++){
          var labInfo = new LabsInfo({
            start_time: new Date(startTime),
            end_time: new Date(endTime),
            lab: lab._id,
            user: $scope.authentication.user._id
          });
          labInfo.$save();

          startTime = startTime + intervalMillisecond;
          endTime = endTime + intervalMillisecond;
        }

      }

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
.controller('LabsInfoController', ['$scope', 'LabsInfo', 'Authentication', '$stateParams',
  function($scope, LabsInfo, Authentication, $stateParams){
    $scope.authentication = Authentication;

    $scope.isBackPage = !$stateParams.private;
    // $scope.$watch("$stateParams", )
    LabsInfo.query($stateParams).$promise.then(function(labsInfo){
      var now = new Date().getTime();
      $scope.labsInfo = labsInfo.filter(function(labInfo){
        if(new Date(labInfo.end_time).getTime() > now){
          return true;
        }
        return false;
      });
      $scope.totalLabsInfo = $scope.labsInfo.length;

      $scope.labsInfoCurrentPage = 1;
      $scope.labsInfoPerPage = 10;

      $scope.pageChanged = function() {
        var startIndex = ($scope.labsInfoCurrentPage-1)*10;
        var endIndex = startIndex + $scope.labsInfoPerPage;

        $scope.currentLabsInfo = $scope.labsInfo.slice(startIndex, endIndex);
      };
      $scope.pageChanged();
    });

    $scope.remove = function(index){
      var labInfo = $scope.labsInfo.splice(index, 1)[0];
      labInfo.lab = labInfo.lab._id;

      labInfo.$remove();
    };
  }
]);