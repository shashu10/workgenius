angular.module('workgenius.directives', [])

.directive('gridDays', function() {
  return {
    templateUrl: 'templates/shared/grid-days.html',
    restrict: 'E',
  };
})
.directive('companies', function() {
  return {
    templateUrl: 'templates/shared/companies.html',
    restrict: 'E',
  };
})
.directive('shiftList', function() {
  return {
    templateUrl: 'templates/shared/shift-list.html',
    restrict: 'E',
  };
})
.directive('hiddenSubmit', function() {
  return {
    templateUrl: 'templates/shared/hidden-submit.html',
    restrict: 'E',
  };
})
.directive('wgPager', function() {
  return {
    templateUrl: 'templates/shared/wg-pager.html',
    restrict: 'E',
  };
})
.directive('wgCompanyFooter', function() {
  return  {
    templateUrl: 'templates/shared/wg-company-footer.html',
    restrict: 'E',
  };
})
.directive('deviceType', function() {
  return {
    templateUrl: 'templates/shared/device-type.html',
    scope: {
        prefilledDevice: '=',
        device: '=',
        onChange: '=',
    }
  };
})
.directive('personalInfo', function() {
  return {
    templateUrl: 'templates/shared/personal-info.html',
    scope: {
        currentUser: '=',
        onChange: '=',
    }
  };
})
.directive('vehicleTypes', function() {
  return {
    templateUrl: 'templates/shared/vehicle-types.html',
    scope: {
        vehicles: '=',
        onChange: '=',
    },
    controller: ['$scope', '$rootScope',
    function($scope, $rootScope) {
      $scope.car = _.find($scope.vehicles, function(vehicle) { return vehicle.name === "car"; });
    }]
  };
})

// https://github.com/zemirco/ng-form-shake
.directive('shakeThat', ['$animate', function($animate) {

    return {
        require: '^form',
        scope: {
            submit: '&',
            submitted: '='
        },
        link: function(scope, element, attrs, form) {
            var inputs = element[0].querySelectorAll('input');

            // listen on submit event
            element.on('submit', function() {
                // tell angular to update scope
                scope.$apply(function() {

                    var validity = true;
                    _.forEach(inputs, function(input) {
                        var el = angular.element(input);
                        if (el.attr('pattern') && !el.val()) {
                            validity = false;
                            el.removeClass('ng-valid');
                        }
                    });

                    // everything ok -> call submit fn from controller
                    if (validity && form.$valid) return scope.submit();

                    // show error messages on submit
                    scope.submitted = true;
                    // shake that form
                    _.forEach(inputs, function(input) {
                        if (angular.element(input).hasClass('ng-valid')) return;
                        $animate.addClass(input, 'shake').then(function() {
                            $animate.removeClass(input, 'shake');
                        });
                    });
                });
            });
        }
    };

}])

/**
 * Save bar looks for changes in a property and saves it on that property's onChange event.
 * Using debounce to have a buffer for saving.
 */
.directive('wgSaveBar', function() {
  return {
    templateUrl: 'templates/shared/wg-save-bar.html',
    scope: {
        wgOnChange: '=',
        wgSuccess: '=',
        wgCustomSave: '=',
        wgProp: '=',
        wgCustomTitle: '='
    },
    controller: ['$scope', '$rootScope', '$timeout', 'setUserData', 'debounce',
    function($scope, $rootScope, $timeout, setUserData, debounce) {


      $scope.show = false;
      $scope.wgSuccess = success;
      $scope.wgOnChange = function () {
        $timeout.cancel(timer);
        $scope.show = false;
        debouncedSave();
      };

      var timer;


      var debouncedSave = debounce(function () {
          if ($scope.wgCustomSave) $scope.wgCustomSave(success);
          else setUserData.save($scope.wgProp, success);
        }, 500, false);


      function success () {
        $scope.show = true;
        if (Parse.User.current()) $scope.$apply();
        $timeout.cancel(timer);
        timer = $timeout(function () {
          $scope.show = false;
          if (Parse.User.current()) $scope.$apply();
        }, 2000);
      }
    }]
  };
})
.factory('debounce', ['$timeout', '$q', function($timeout, $q) {
  return function(func, wait, immediate) {
    var timeout;
    var deferred = $q.defer();
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if(!immediate) {
          deferred.resolve(func.apply(context, args));
          deferred = $q.defer();
        }
      };
      var callNow = immediate && !timeout;
      if ( timeout ) {
        $timeout.cancel(timeout);
      }
      timeout = $timeout(later, wait);
      if (callNow) {
        deferred.resolve(func.apply(context,args));
        deferred = $q.defer();
      }
      return deferred.promise;
    };
  };
}])
// Only one instance of ionAffix works at a time.
 .directive('ionAffix', ['$compile', 'utils', function ($compile, utils) {
    // keeping the Ionic specific stuff separated so that they can be changed and used within another context

    var CALCULATION_THROTTLE_MS = 500;

    return {
        // only allow adding this directive to elements as an attribute
        restrict: 'A',
        // we need $ionicScroll for adding the clone of affix element to the scroll container
        // $ionicScroll.element gives us that
        require: '^$ionicScroll',
        link: function (scope, element, attr, $ionicScroll) {

            // get the affix's container. element will be affix for that container.
            // affix's container will be matched by "affix-within-parent-with-class" attribute.
            // if it is not provided, parent element will be assumed as the container
            var $container = null;

            var scrollMin = 0;
            var scrollMax = 0;
            var scrollTransition = 0;

            // throttled version of the same calculation
            var throttledCalculateScrollLimits = null;
            var affixClone = null;

            // calculate the scroll limits for the affix element and the affix's container
            var calculateScrollLimits = function (scrollTop) {
                var containerPosition = utils.position($container);
                var elementOffset = utils.offset(element);

                var containerTop = containerPosition.top;
                var containerHeight = containerPosition.height;

                var affixHeight = elementOffset.height;

                scrollMin = scrollTop + containerTop;
                scrollMax = scrollMin + containerHeight;
                scrollTransition = scrollMax - affixHeight;
            };

            // creates the affix clone and adds it to DOM. by default it is put to top
            var createAffixClone = function () {
                var clone = element.clone().css({
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0
                  });

                // if directive is given an additional CSS class to apply to the clone, then apply it
                if (attr.affixClass) {
                    clone.addClass(attr.affixClass);
                }

                // remove the directive matching attribute from the clone, so that an affix is not created for the clone as well.
                clone.removeAttr('ion-affix').removeAttr('data-ion-affix').removeAttr('x-ion-affix');

                angular.element($ionicScroll.element).append(clone);

                // compile the clone so that anything in it is in Angular lifecycle.
                $compile(clone)(scope);

                return clone;
            };

            // removes the affix clone from DOM. also deletes the reference to it in the memory.
            var removeAffixClone = function () {
                if (affixClone)
                    affixClone.remove();
                affixClone = null;
            };

            var setScrollListener = function () {
              if (attr.affixWithinParentWithClass) {
                  $container = utils.getParentWithClass(element, attr.affixWithinParentWithClass);
                  if (!$container) {
                      $container = element.parent();
                  }
              } else {
                  $container = element.parent();
              }

              // see http://underscorejs.org/#throttle
              throttledCalculateScrollLimits = ionic.Utils.throttle(
                  calculateScrollLimits,
                  CALCULATION_THROTTLE_MS,
                  {trailing: false}
              );
              angular.element($ionicScroll.element).on('scroll', function (event) {
                var ev = (event.detail || event.originalEvent && event.originalEvent.detail);
                  var scrollTop = (ev && ev.scrollTop) || 0;
                  // when scroll to top, we should always execute the immediate calculation.
                  // this is because of some weird problem which is hard to describe.
                  // if you want to experiment, always use the throttled one and just click on the page
                  // you will see all affix elements stacked on top
                  if (scrollTop === 0) {
                      calculateScrollLimits(scrollTop);
                  }
                  else {
                      throttledCalculateScrollLimits(scrollTop);
                  }

                  // when we scrolled to the container, create the clone of element and place it on top
                  if (scrollTop > scrollMin + 1 && scrollTop <= scrollMax) {

                      // we need to track if we created the clone just now
                      // that is important since normally we apply the transforms in the animation frame
                      // but, we need to apply the transform immediately when we add the element for the first time. otherwise it is too late!
                      var cloneCreatedJustNow = false;
                      if (!affixClone) {
                          affixClone = createAffixClone();
                          cloneCreatedJustNow = true;
                      }

                      // if we're reaching towards the end of the container, apply some nice translation to move up/down the clone
                      // but if we're reached already to the container and we're far away than the end, move clone to top
                      if (scrollTop > scrollTransition) {
                          utils.translateUp(affixClone[0], Math.floor(scrollTop - scrollTransition), cloneCreatedJustNow);
                      } else {
                          utils.translateUp(affixClone[0], 0, cloneCreatedJustNow);
                      }
                  } else {
                      removeAffixClone();
                  }
              });
            };


            scope.$on("$destroy", function () {
                // 2 important things on destroy:
                // remove the clone
                // unbind the scroll listener
                // see https://github.com/aliok/ion-affix/issues/1
                removeAffixClone();

                // angular.element($ionicScroll.element).off('scroll');
                // setScrollListener();
            });

            setScrollListener();
        }
    };
}])

  // Custom ion-affix for availability
 .directive('wgAvailabilityHeader', ['$compile', 'utils', function ($compile, utils) {
    // keeping the Ionic specific stuff separated so that they can be changed and used within another context

    var CALCULATION_THROTTLE_MS = 500;

    return {
        restrict: 'A',
        require: '^$ionicScroll',
        link: function (scope, element, attr, $ionicScroll) {
            var $container = null;
            var affixClone = null;
            var createAffixClone = function () {
                var clone = angular.element('<div class="wg-grid-days" ng-controller="AvailabilityCtrl"><div class="row wg-grid-header"><div class="first"></div><div class="col" ng-click="select(\'MON\', null)">M</div><div class="col" ng-click="select(\'TUE\', null)">T</div><div class="col" ng-click="select(\'WED\', null)">W</div><div class="col" ng-click="select(\'THU\', null)">T</div><div class="col" ng-click="select(\'FRI\', null)">F</div><div class="col" ng-click="select(\'SAT\', null)">S</div><div class="col" ng-click="select(\'SUN\', null)">S</div></div></div>')
                  .css({
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0
                  });

                angular.element($ionicScroll.element).append(clone);
                $compile(clone)(scope);
                return clone;
            };

            var removeAffixClone = function () {
                if (affixClone)
                    affixClone.remove();
                affixClone = null;
            };

            var setScrollListener = function () {
              if (attr.affixWithinParentWithClass) {
                  $container = utils.getParentWithClass(element, attr.affixWithinParentWithClass);
                  if (!$container) {
                      $container = element.parent();
                  }
              } else {
                  $container = element.parent();
              }
              angular.element($ionicScroll.element).on('scroll', function (event) {

                  // when we scrolled to the container, create the clone of element and place it on top
                  if (utils.position($container).top < 0) {
                      if (!affixClone) {
                          affixClone = createAffixClone();
                      }
                  } else {
                      removeAffixClone();
                  }
              });
            };


            scope.$on("$destroy", function () {
                removeAffixClone();
            });
            setScrollListener();
        }
    };
}]);