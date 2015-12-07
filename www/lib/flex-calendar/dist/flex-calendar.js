(function(){
  "use strict";
  angular
    .module('flexcalendar', [])
    .directive('flexCalendar', flexCalendar)
    .directive('flexWeek', flexWeek);

    function flexCalendar() {

      var directive = {
        restrict: 'E',
        scope: {
          options: '=?',
          events: '=?'
        },
        template: template,
        controller: Controller
      };

      return directive;

    }

    function flexWeek() {

      var directive = {
        restrict: 'E',
        scope: {
          options: '=?',
          events: '=?'
        },
        template: weekTemplate,
        controller: Controller
      };

      return directive;

    }

      var template =
      '<div class="flex-calendar">'+
        '<div class="month">'+
          '<div class="arrow {{arrowPrevClass}}" ng-click="prevSlide()"><i class="icon ion-chevron-left"></i></div>'+
          '<div class="label">{{selectedMonth | uppercase | translate}} {{selectedYear | uppercase}}</div>'+
          '<div class="arrow {{arrowNextClass}}" ng-click="nextSlide()"><i class="icon ion-chevron-right"></i></div>'+
        '</div>'+
        '<div class="week">'+
          '<div class="day" ng-repeat="day in weekDays(options.dayNamesLength) track by $index">{{ day }}</div>'+
        '</div>'+
        '<ion-slide-box show-pager="false" on-slide-changed="monthHasChanged($index)">' +

          '<ion-slide ng-repeat="curr in months">' +
            '<div class="days" ng-repeat="week in curr.weeks">'+
              '<div class="day"'+
                'ng-repeat="day in week track by $index"'+
                'ng-class="{selected: isDefaultDate(day), event: day.event[0], disabled: day.disabled, blocked: day.blocked, out: !day}"'+
                'ng-click="onClick(day, $index, $event)"'+
              '>'+
                '<div class="number">{{day.day}}</div>'+
              '</div>'+
            '</div>'+
          '</ion-slide>' +
        '</ion-slide-box>' +
      '</div>';

      var weekTemplate =
      '<div class="flex-calendar padding-bottom">'+
        '<div class="week">'+
          '<div class="day" ng-repeat="day in weekDays(options.dayNamesLength) track by $index">{{ day }}</div>'+
        '</div>'+

        '<ion-slide-box active-slide="activeSlide" class="week-view" show-pager="false" on-slide-changed="weekHasChanged($index)">' +
            '<ion-slide class="days" ng-repeat="week in allWeeks">'+
              '<div class="day"'+
                'ng-repeat="day in week track by $index"'+
                'ng-class="{selected: isDefaultDate(day), event: day.event[0], disabled: day.disabled, out: !day}"'+
                'ng-click="onClick(day, $index, $event)"'+
              '>'+
                '<div class="number">{{day.day}}</div>'+
              '</div>'+
            '</ion-slide>'+
        '</ion-slide-box>' +
        '<i class="icon ion-arrow-left-c left-icon" ng-click="prevSlide()"></i>' +
        '<i class="icon ion-arrow-right-c right-icon" ng-click="nextSlide()"></i>' +
      '</div>';

    Controller.$inject = ['$scope' , '$filter', '$ionicSlideBoxDelegate'];

    function Controller($scope , $filter, $ionicSlideBoxDelegate) {

      $scope.days = [];
      $scope.options = $scope.options || {};
      $scope.events = $scope.events || [];
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

      if($scope.options.disabledDates) {
        createMappedDisabledDates();
      }

      if($scope.events)
      {
        createMappedEvents();
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

      function createMappedDisabledDates(){
        if(!$scope.options.disabledDates) return;
        $scope.mappedDisabledDates = $scope.options.disabledDates.map(function(date)
        {
          return new Date(date);
        });
      }

      function createMappedEvents(){
        $scope.mappedEvents = $scope.events.map(function(obj)
        {
          obj.date = new Date(obj.date);
          return obj;
        });
      }

      $scope.$watch('options.defaultDate', function() {
        calculateSelectedDate();
      });

      $scope.$watch('options.disabledDates', function() {
        if($scope.options.disabledDates) {
            createMappedDisabledDates();
            calculateDisabledDates();
        }
      });

      $scope.$watch('events', function() {
        createMappedEvents();
        calculateWeeks();
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

      function onClickBlock(date, index, domEvent) {
        if (date && !date.disabled && isAfterToday(date.date)) {
          if (date.event.length) {
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
        if (!date || !$scope.mappedEvents) { return; }
        date.event = [];
        $scope.mappedEvents.forEach(function(event) {
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
        if (!$scope.mappedDisabledDates) return false;
        for(var i = 0; i < $scope.mappedDisabledDates.length; i++){
          if(date.year === $scope.mappedDisabledDates[i].getFullYear() && date.month === $scope.mappedDisabledDates[i].getMonth() && date.day === $scope.mappedDisabledDates[i].getDate()){
            return true;
          }
        }
      }

      function blockedDate(date) {
        if (!$scope.blockedDates) return false;
        // for(var i = 0; i < $scope.blockedDates.length; i++){
        //   if(date.year === $scope.blockedDates[i].getFullYear() && date.month === $scope.blockedDates[i].getMonth() && date.day === $scope.blockedDates[i].getDate()){
            return true;
        //   }
        // }
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
            if ($scope.mappedEvents) { bindEvent(week[dayNumber]); }
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

        $scope.weeks = [];
        populateWeek(MONTHS.indexOf($scope.selectedMonth), $scope.selectedYear, $scope.weeks);

        (!$scope.allowedPrevMonth()) ? $scope.arrowPrevClass = "hidden" : $scope.arrowPrevClass = "visible";
        (!$scope.allowedNextMonth()) ? $scope.arrowNextClass = "hidden" : $scope.arrowNextClass = "visible";
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
        if (!$scope.mappedDisabledDates || $scope.mappedDisabledDates.length === 0) return;
        for(var i = 0; i < $scope.mappedDisabledDates.length; i++){
          $scope.mappedDisabledDates[i] = new Date($scope.mappedDisabledDates[i]);
        }
        calculateWeeks();
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
    }

})();
