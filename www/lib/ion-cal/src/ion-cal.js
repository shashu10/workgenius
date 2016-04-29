(function(){
  "use strict";
  angular
    .module('ioncal', [])
    .directive('ionCal', ionCal);

    function ionCal() {

      var directive = {
        restrict: 'E',
        scope: {
          options: '=?',
          events: '=?'
        },
        template: function(elem, attr){
          if (attr.calType === 'week')
            return weekTemplate
          else
            return template
        },
        controller: Controller
      };

      return directive;

    }

      var _month_header = 
      '<div class="month">'+
          '<div class="arrow {{arrowPrevClass}}" ng-click="prevSlide()"><i class="icon ion-chevron-left"></i></div>'+
          '<div class="label">{{selectedMonth | uppercase | translate}} {{selectedYear | uppercase}}</div>'+
          '<div class="arrow {{arrowNextClass}}" ng-click="nextSlide()"><i class="icon ion-chevron-right"></i></div>'+
        '</div>';

      var _week_header =
        '<div class="week">'+
          '<div class="day" ng-repeat="day in weekDays(options.dayNamesLength) track by $index">{{ day }}</div>'+
        '</div>';

      var _day_row =
      '<div class="day"'+
        'ng-repeat="day in week track by $index"'+
        'ng-class="{selected: isDefaultDate(day), event: day.event[0], disabled: day.disabled, blocked: day.blocked, out: !day}"'+
        'ng-click="onClick(day, $index, $event)"'+
      '>'+
        '<div class="number">{{day.day}}</div>'+
      '</div>';

      var template =
      '<div class="ion-cal ion-month">'+
        _month_header+
        _week_header+
        '<ion-slide-box show-pager="false" on-slide-changed="monthHasChanged($index)">'+
          '<ion-slide ng-repeat="curr in months">'+
            '<div class="days" ng-repeat="week in curr.weeks">'+
              _day_row+
            '</div>'+
          '</ion-slide>'+
        '</ion-slide-box>'+
      '</div>';

      var weekTemplate =
      '<div class="ion-cal ion-week">'+
        _week_header+

        '<ion-slide-box active-slide="activeSlide" show-pager="false" on-slide-changed="weekHasChanged($index)">'+
            '<ion-slide class="days" ng-repeat="week in allWeeks">'+
              _day_row+
            '</ion-slide>'+
        '</ion-slide-box>'+
      '</div>';

    Controller.$inject = ['$scope' , '$filter', '$ionicSlideBoxDelegate', '$ionicPopup'];

    function Controller($scope , $filter, $ionicSlideBoxDelegate, $ionicPopup) {

      $scope.days = [];
      $scope.options = $scope.options || {};
      $scope.events = $scope.events || [];
      $scope.options.disabledDates = $scope.options.disabledDates || [];
      $scope.options.dayNamesLength = $scope.options.dayNamesLength || 1;
      $scope.options.mondayIsFirstDay = $scope.options.mondayIsFirstDay || false;

      if ($scope.options.disableClickedDates) {
        $scope.onClick = onClickBlock;
      } else {
        $scope.onClick = onClick;
      }

      $scope.allowedPrevMonth = allowedPrevMonth;
      $scope.allowedNextMonth = allowedNextMonth;
      $scope.weekDays = weekDays;
      $scope.isDefaultDate = isDefaultDate;

      $scope.arrowPrevClass = "visible";
      $scope.arrowNextClass = "visible";

      var $translate = $filter('translate');

      var MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
      var WEEKDAYS = ['SUNDAY' , 'MONDAY' , 'TUESDAY' , 'WEDNESDAY' , 'THURSDAY' , 'FRIDAY' , 'SATURDAY'];

      if($scope.options.mondayIsFirstDay)
      {
        var sunday = WEEKDAYS.shift();
        WEEKDAYS.push(sunday);
      }

      if ($scope.options.minDate) {
        $scope.options.minDate = new Date($scope.options.minDate);
      }

      if ($scope.options.maxDate) {
        $scope.options.maxDate = new Date($scope.options.maxDate);
      }

      calculateMonths();
      slideToCurrentWeek();

      $scope.nextSlide = function () {
        $ionicSlideBoxDelegate.next();
      };
      $scope.prevSlide = function () {
        $ionicSlideBoxDelegate.previous();
      };

      function slideToCurrentWeek () {
        var today = new Date();
        for (var j = 0; j < $scope.allWeeks.length; j++) {
          var week = $scope.allWeeks[j];
          for (var i = 0; i < week.length; i++) {
            if (!week[i]) continue;
            
            if (week[i].date.getFullYear() === today.getFullYear() &&
              week[i].date.getMonth() === today.getMonth() &&
              week[i].date.getDate() === today.getDate()) {
              $scope.activeSlide = j;
              return;
            }
          }
        }
      }

      $scope.$watch('options.defaultDate', function() {
        calculateSelectedDate();
      });

      $scope.$watch('options.disabledDates', function() {
        if($scope.options.disabledDates) {
            calculateDisabledDates();
        }
      });

      $scope.$watch('events', function() {
        updateEvents();
      });

      $scope.$watch('weeks', function(weeks) {
        var filteredEvents = [];
        angular.forEach(weeks, function(week) {
          angular.forEach(week, function (day) {
            if(day && day.event) {
              angular.forEach(day.event, function(event) {
                filteredEvents.push(event);
              });
            }
          });
        });
        if('function' === typeof $scope.options.filteredEventsChange){
          $scope.options.filteredEventsChange(filteredEvents);
        }
      });

      $scope.$watch('selectedYear', function(year, previousYear) {
        if(year !== previousYear) calculateWeeks();
      });
      $scope.$watch('selectedMonth', function(month, previousMonth) {
        if(month !== previousMonth) calculateWeeks();
      });

      $scope.monthHasChanged = function ($index) {

        var curr = $scope.months[$index];
        $scope.selectedYear = curr.year;
        $scope.selectedMonth = MONTHS[curr.month];
        var month = {name: $scope.selectedMonth, index: curr.month + 1, _index: curr.month+2 };

        var blockedDays = getBlockedDays();
        $scope.options.changeMonth(month, $scope.selectedYear, blockedDays);

        // if ($index === 0)
        //   $scope.options.defaultDate = new Date();

        // else
        //   $scope.options.defaultDate = new Date($scope.selectedYear + "/" + (curr.month + 1) + "/1");
      };
      $scope.weekHasChanged = function ($index) {

        var week = $scope.allWeeks[$index];

        for (var i = 0; i < week.length; i++) {
          var curr = week[i];
          if (curr) {
            if ($scope.selectedMonth === MONTHS[curr.month])
              return;
            $scope.selectedYear = curr.year;
            $scope.selectedMonth = MONTHS[curr.month];
            var month = {name: $scope.selectedMonth, index: curr.month + 1, _index: curr.month+2 };
            $scope.options.changeMonth(month, $scope.selectedYear);
          }
        }
      };

      /////////////////

      $scope.dividerFunction = function(date){
        return moment(date).format('MMM dddd Do');
      };

      $scope.formatAMPM = function (date) {
        return moment(date).format('ha');
      };

      $scope.shiftEarnings = function(shift) {
          return (shift.endsAt.getTime() - shift.startsAt.getTime()) / 3600000 * 15;
      };
      $scope.strikes = function (shifts) {
        var strikes = 0;
        for (var i = 0; i < shifts.length; i++) {
          var shift = shifts[i];
          var deadline = moment().add(72, 'hours');
          if (deadline.isAfter(shift.startsAt)) {
            strikes++;
          }
        }
        return strikes;
      };
      function blockWithEvents (date) {
        $scope.selectedEvents = date.event;
        var thisThese = $scope.selectedEvents.length > 1 ? 'these shifts' : 'this shift';
        return $ionicPopup.show({
          cssClass: 'block-popup',
          template: '<ion-list><ion-item ng-repeat="shiftToCancel in selectedEvents"><img ng-src="img/companies/{{shiftToCancel.company.toLowerCase()}}.png" alt=""><p>{{shiftToCancel.company}} | Earnings Est: ${{shiftEarnings(shiftToCancel)}}</p><p>{{dividerFunction(shiftToCancel.startsAt)}}, {{formatAMPM(shiftToCancel.startsAt) | uppercase}} - {{formatAMPM(shiftToCancel.endsAt) | uppercase}}</p></ion-item><p ng-if="strikes(selectedEvents)">WARNING: You\'ll get {{strikes(selectedEvents)}} strike{{strikes(selectedEvents) > 1 ? "s" : ""}}</p></ion-list>',
          title: 'Blocking this day will<br>cancel ' + thisThese,
          scope: $scope,
          buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
              text: 'No, Leave it',
              type: 'button-dark',
              onTap: function(e) {
                return false;
              }
            }, {
              text: 'Yes, Block',
              type: 'button-assertive',
              onTap: function(e) {
                return true;
              }
            }]
        });
      }

      function onClickBlock(date, index, domEvent) {
        if (date && !date.disabled && isAfterToday(date.date)) {
          if (date.event.length) {
            blockWithEvents(date)
            .then(function(block) {

              if (block) {
                date.blocked = !date.blocked;
                date.event = [];
                var blockedDays = getBlockedDays();

                $scope.options.blockClick(date, blockedDays, domEvent);
              }
            });
            return;
          }
          date.blocked = !date.blocked;
          var blockedDays = getBlockedDays();

          $scope.options.blockClick(date, blockedDays, domEvent);
        }
      }

      function getBlockedDays () {
        var blockedDays = [];
        for (var i = 0; i < $scope.months.length; i++) {
          var month = $scope.months[i];

          for (var j = 0; j < month.weeks.length; j++) {
            var week = month.weeks[j];

            for (var k = 0; k < week.length; k++) {
              var day = week[k];

              if (day && day.blocked) {
                blockedDays.push({
                  day: day.day,
                  month: Number(day.month) + 1,
                  year: day.year,
                });
              }
            }
          }
        }
        return blockedDays;
      }

      function onClick(date, index, domEvent) {
        if (!date || date.disabled) { return; }
        $scope.options.defaultDate = date.date;
        clickHandler(date, domEvent);
      }

      function clickHandler (date, domEvent) {

        if (date.event && date.event.length) {
          $scope.options.eventClick(date, domEvent);

        } else {
          $scope.options.dateClick(date, domEvent);
        }
      }
      function bindEvent(date) {
        if (!date || !$scope.events) { return; }
        date.event = [];
        $scope.events.forEach(function(event) {
          if (sameDate(date.date, event.date)) {
            date.event.push(event);
          }
        });
      }
      function sameDate(d1, d2) {
        var current = new Date(d1).setHours(0, 0, 0, 0);
        var previous = new Date(d2).setHours(0, 0, 0, 0);

        if(current === previous){
            return true;
        }
        return false;
      }
      function isAfterToday (date) {
        var current = new Date(date).setHours(0, 0, 0, 0);
        var today = new Date().setHours(0, 0, 0, 0);

        if(current > today){
            return true;
        }
        return false;
      }
      function allowedDate(date) {
        if (!$scope.options.minDate && !$scope.options.maxDate) {
          return true;
        }
        var currDate = date.date;
        if ($scope.options.minDate && (currDate < $scope.options.minDate)) { return false; }
        if ($scope.options.maxDate && (currDate > $scope.options.maxDate)) { return false; }
        return true;
      }

      function disabledDate(date) {
        if (!$scope.options.disabledDates) return false;
        for(var i = 0; i < $scope.options.disabledDates.length; i++){
          if(date.year === $scope.options.disabledDates[i].getFullYear() && date.month === $scope.options.disabledDates[i].getMonth() && date.day === $scope.options.disabledDates[i].getDate()){
            return true;
          }
        }
      }

      function blockedDate(date) {
        if (!$scope.options.blockedDays) return false;
        for (var i = 0; i < $scope.options.blockedDays.length; i++) {
          var d = $scope.options.blockedDays[i];
          if (date.day === d.day && date._month === d.month && date.year === d.year)
            return true;
        }
        return false;
      }

      function allowedPrevMonth(currMonth, currYear) {
        var prevYear = null;
        var prevMonth = null;
        if (!$scope.options.minDate) { return true; }
        currMonth = currMonth || MONTHS.indexOf($scope.selectedMonth);
        currYear = currYear || $scope.selectedYear;
        if (currMonth === 0) {
          prevYear = (currYear - 1);
          prevMonth = 11;
        } else {
          prevYear = currYear;
          prevMonth = (currMonth - 1);
        }
        if (prevYear < $scope.options.minDate.getFullYear()) { return false; }
        if (prevYear === $scope.options.minDate.getFullYear()) {
          if (prevMonth < $scope.options.minDate.getMonth()) { return false; }
        }
        return true;
      }

      function allowedNextMonth(currMonth, currYear) {
        var nextYear = null;
        var nextMonth = null;

        if (currMonth === undefined)
          currMonth = MONTHS.indexOf($scope.selectedMonth);
        if (currYear === undefined)
          currYear = $scope.selectedYear;

        if (currMonth === 11) {
          nextYear = (currYear + 1);
          nextMonth = 0;
        } else {
          nextYear = currYear;
          nextMonth = (currMonth + 1);
        }
        if (!$scope.options.maxDate) { return newMonth(nextMonth, nextYear); }
        if (nextYear > $scope.options.maxDate.getFullYear()) { return false; }
        if (nextYear === $scope.options.maxDate.getFullYear()) {
          if (nextMonth > $scope.options.maxDate.getMonth()) { return false; }
        }
        return newMonth(nextMonth, nextYear);
      }
      
      function newMonth (m, y) {
        return {
          month: m,
          year: y,
          weeks: populateWeek(m, y, [])
        };
      }
      function calculateMonths() {
        $scope.months = [];
        $scope.allWeeks = [];
        var curr = newMonth($scope.options.minDate.getMonth(), $scope.options.minDate.getFullYear());

        while (curr) {
          $scope.months.push(curr);
          $scope.allWeeks = $scope.allWeeks.concat(curr.weeks);

          curr = allowedNextMonth(curr.month, curr.year);
        }
      }

      function populateWeek (currMonth, currYear, currWeeks) {

        var week = null;
        var daysInCurrentMonth = new Date(currYear, currMonth + 1, 0).getDate();

        for (var day = 1; day < daysInCurrentMonth + 1; day += 1) {
          var date = new Date(currYear, currMonth, day);
          var dayNumber = new Date(currYear, currMonth, day).getDay();
          if($scope.options.mondayIsFirstDay)
          {
            dayNumber = (dayNumber + 6) % 7;
          }
          week = week || [null, null, null, null, null, null, null];
          week[dayNumber] = {
            year: currYear,
            month: currMonth,
            day: day,
            date: date,
            _month : date.getMonth() + 1
          };

          if (allowedDate(week[dayNumber])) {
            if ($scope.events) { bindEvent(week[dayNumber]); }
          } else {
            week[dayNumber].disabled = true;
          }

          if (week[dayNumber] && disabledDate(week[dayNumber])) {
            week[dayNumber].disabled = true;
          }

          if (week[dayNumber] && blockedDate(week[dayNumber])) {
            week[dayNumber].blocked = true;
          }          

          if (dayNumber === 6 || day === daysInCurrentMonth) {
            currWeeks.push(week);
            week = undefined;
          }
        }

        return currWeeks;
       }
      function calculateWeeks(currMonth, currYear, currWeeks) {

        // $scope.weeks = [];
        // populateWeek(MONTHS.indexOf($scope.selectedMonth), $scope.selectedYear, $scope.weeks);

        // (!$scope.allowedPrevMonth()) ? $scope.arrowPrevClass = "hidden" : $scope.arrowPrevClass = "visible";
        // (!$scope.allowedNextMonth()) ? $scope.arrowNextClass = "hidden" : $scope.arrowNextClass = "visible";
      }

      function calculateSelectedDate() {
        if ($scope.options.defaultDate) {
          $scope.options._defaultDate = new Date($scope.options.defaultDate);
        } else {
          $scope.options._defaultDate = new Date();
        }

        $scope.selectedYear  = $scope.options._defaultDate.getFullYear();
        $scope.selectedMonth = MONTHS[$scope.options._defaultDate.getMonth()];
        $scope.selectedDay   = $scope.options._defaultDate.getDate();
      }

      function calculateDisabledDates() {
        if (!$scope.options.disabledDates || $scope.options.disabledDates.length === 0) return;
        for(var i = 0; i < $scope.options.disabledDates.length; i++){
          $scope.options.disabledDates[i] = new Date($scope.options.disabledDates[i]);
        }
        // calculateWeeks();
      }

      function weekDays(size) {
        return WEEKDAYS.map(function(name) { return $translate(name).slice(0, size); });
      }

      function isDefaultDate(date) {
        if (!date) { return; }
        var result = date.year === $scope.options._defaultDate.getFullYear() &&
          date.month === $scope.options._defaultDate.getMonth() &&
          date.day === $scope.options._defaultDate.getDate();
        return result;
      }

      function updateEvents () {
        for (var i = 0; i < $scope.allWeeks.length; i++) {
          var week = $scope.allWeeks[i];
          for (var j = 0; j < week.length; j++) {
            var day = week[j];
            if (day) {
              bindEvent(day);
            }
          }
        }
      }
    }

})();
