angular.module('workgenius.directives', [])

.directive('days', function() {
  return {
    templateUrl: 'templates/days.html'
  };
})
.directive('companies', function() {
  return {
    templateUrl: 'templates/companies.html'
  };
})
.directive('eventList', function() {
  return {
    templateUrl: 'templates/EventList.html'
  };
})
.directive('shift', function() {
  return {
    templateUrl: 'templates/shift.html'
  };
})
.directive('colorDivider', function() {
  return {
    templateUrl: 'templates/colorDivider.html'
  };
})
.directive('weeklyTargetControls', function() {
  return {
    templateUrl: 'templates/weeklyTargetControls.html'
  };
})

.directive('standardTimeMeridian', function () {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            etime: '=etime'
        },
        template: "<strong>{{stime}}</strong>",
        link: function (scope, elem, attrs) {

            scope.stime = epochParser(scope.etime, 'time');

            function prependZero(param) {
                if (String(param).length < 2) {
                    return "0" + String(param);
                }
                return param;
            }

            function epochParser(val, opType) {
                if (val === null) {
                    return "00:00";
                } else {
                    var meridian = ['AM', 'PM'];

                    if (opType === 'time') {
                        var hours = parseInt(val / 3600);
                        var minutes = (val / 60) % 60;
                        var hoursRes = hours > 12 ? (hours - 12) : hours;

                        var currentMeridian = meridian[parseInt(hours / 12)];

                        return (prependZero(hoursRes) + ":" + prependZero(minutes) + " " + currentMeridian);
                    }
                }
            }

            scope.$watch('etime', function (newValue, oldValue) {
                scope.stime = epochParser(scope.etime, 'time');
            });

        }
    };
});