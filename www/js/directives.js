angular.module('workgenius.directives', [])

.directive('gridDays', function() {
  return {
    templateUrl: 'templates/shared/grid-days.html',
  };
})
.directive('workTypes', function() {
  return {
    templateUrl: 'templates/shared/work-types.html'
  };
})
.directive('companies', function() {
  return {
    templateUrl: 'templates/shared/companies.html'
  };
})
.directive('shiftList', function() {
  return {
    templateUrl: 'templates/shared/shift-list.html'
  };
})
.directive('shift', function() {
  return {
    templateUrl: 'templates/shared/shift.html'
  };
})
.directive('colorDivider', function() {
  return {
    templateUrl: 'templates/shared/colorDivider.html'
  };
})
.directive('targetControls', function() {
  return {
    templateUrl: 'templates/shared/targetControls.html'
  };
})
.directive('wgPager', function() {
  return {
    templateUrl: 'templates/shared/wg-pager.html'
  };
})
.directive('wgCompanyFooter', function() {
  return  {
    templateUrl: 'templates/shared/wg-company-footer.html',
    restrict: 'E',
  };
})
.directive('wgWorkTypesFooter', function() {
  return  {
    templateUrl: 'templates/shared/wg-work-types-footer.html',
    restrict: 'E',
  };
})
.directive('wgDraggableFooter', ['$ionicGesture', function($ionicGesture) {

  var link = function (scope, element, attr) {
    var el = angular.element(element.children()[0]);
    var startY = 0, y = 0;
    var dragGesture = null, dragendGesture = null;
    $ionicGesture.on('tap', hide, element);
    $ionicGesture.on('touch', function(event) {
      // Prevent default dragging of selected content
      startY = event.gesture.center.pageY;
      dragGesture = $ionicGesture.on('drag', drag, element);
      dragendGesture = $ionicGesture.on('dragend', dragend, element);
    }, element);

    function drag (event) {

      y = Math.max(event.gesture.center.pageY - startY, 0);
      el.css({
        transform: "translate3d(0, " + y + "px, 0)"
      });
    }

    function dragend (event) {
      $ionicGesture.off(dragGesture, 'drag', drag);
      $ionicGesture.off(dragendGesture, 'dragend', dragend);
      if (y > 10) {
        hide();
      }
    }

    function hide () {
      el.css({
        transform: "translate3d(0, 100%, 0)"
      });
    }
  };

  return  {
    restrict: 'A',
    link: link
  };
}])
.directive('wgSaveBar', function() {
  return {
    templateUrl: 'templates/shared/wg-save-bar.html',
    scope: {
        wgOnChange: '=',
        wgSpecialSave: '=',
        wgProp: '='
    },
    controller: ['$scope', '$rootScope', '$timeout', 'setUserData',
    function($scope, $rootScope, $timeout, setUserData) {

      var copy = angular.copy($rootScope.currentUser[$scope.wgProp]);
      $scope.changed = false;
      $scope.state = 'Save';

      $scope.save = function () {
        // Too fast.
        // $scope.state = 'Saving...';
        if ($scope.wgSpecialSave) {
          $scope.wgSpecialSave();
          $scope.state = 'Saved!';
          copy = angular.copy($rootScope.currentUser[$scope.wgProp]);
          $scope.wgOnChange();
          return;
        }
        setUserData.save($scope.wgProp, function success () {
          $scope.state = 'Saved!';
          copy = angular.copy($rootScope.currentUser[$scope.wgProp]);
          $scope.wgOnChange();
        });
      };

      $scope.wgOnChange = function () {
        if (angular.equals(copy, $rootScope.currentUser[$scope.wgProp])) {
            $scope.changed = false;
        } else {
            $scope.state = 'Save';
            $scope.changed = true;
        }
      };
      $scope.$on('$stateChangeSuccess', function(event, current) {
        $rootScope.currentUser[$scope.wgProp] = angular.copy(copy);
        $scope.wgOnChange();
      });
      $scope.$on('$destroy', function() {
        $rootScope.currentUser[$scope.wgProp] = angular.copy(copy);
        $scope.wgOnChange();
      });
    }]
  };
})
.directive('bounceLeft', ['$interval', function($interval) {
  var isOpen = function (element) {
    var children = element.children();
    if (children && children[0] && children[0].style.transform) {
      if (children[0].style.transform.indexOf('translate3d') > -1) {
        return children[0].style;
      }
    }
    return false;
  };
  var close = function (style) {
    style.transform = '';
  };
  return function(scope, element, attr) {
    var bounce;
    // stops bounce when dragging left
    element.on('drag', function(event) {
      element.removeClass('bounce-left');
      $interval.cancel(bounce);
      bounce = undefined;
    });
    element.on('click', function(event) {
      var open = isOpen(element);
      if (open) {
        close(open);
        return;
      }

      // Prevent default dragging of selected content
      if (element.hasClass('bounce-left')) return;
      event.preventDefault();
      element.addClass('bounce-left');
      bounce = $interval(function() {
        element.removeClass('bounce-left');
      }, 1000, 1);

    });
  };
}])
.directive('flexCalendarSubheader', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(function() {

        var height = element[0].offsetHeight + element[0].offsetTop;
        
        // Get the ion-content element containing has-subheader
        var content = angular.element(document.querySelector('.has-flex-calendar-subheader'));

        content.css("top", height + "px");
      });
    }
  };
})
.directive('focusOnTap', ['$ionicGesture', '$timeout', function($ionicGesture, $timeout) {
  return function(scope, element, attr) {
    var listener = function (event) {
      $timeout(function() {
        element.children()[0].focus(); 
      });
    };
    var gesture = $ionicGesture.on('tap', listener, element);

    scope.$on('$destroy', function() {
      $ionicGesture.off(gesture, 'tap', listener);
    });
  };
}])
.directive('wgProfilePhoto', function() {
  return {
      templateUrl: 'templates/shared/wg-profile-photo.html',
      controller: ['$scope', '$ionicActionSheet', '$cordovaCamera', '$rootScope', function($scope, $ionicActionSheet, $cordovaCamera, $rootScope) {

          $scope.changePhoto = function() {
              // Show the action sheet
              var hideSheet = $ionicActionSheet.show({
                  buttons: [{
                      text: 'Choose from library'
                  }, {
                      text: 'Take profile picture'
                  }],
                  destructiveText: 'Remove photo',
                  titleText: 'Change your profile photo',
                  cancelText: 'Cancel',
                  cancel: function() {
                      // add cancel code..
                  },
                  destructiveButtonClicked: function () {
                    $rootScope.imageURL = "img/profile_default.jpg";
                    hideSheet();
                  },
                  buttonClicked: function(index) {
                      switch(index) {
                        case 0:
                          $scope.addImage("PHOTOLIBRARY");
                          break;
                        case 1:
                          $scope.addImage("CAMERA");
                          break;
                      }
                      hideSheet();
                  }
              });
          };

          $scope.addImage = function(type) {
              // 2
              var options = {
                  destinationType: Camera.DestinationType.FILE_URI,
                  sourceType: Camera.PictureSourceType[type],
                  allowEdit: false,
                  encodingType: Camera.EncodingType.JPEG,
                  correctOrientation: true,
                  popoverOptions: CameraPopoverOptions,
              };

              // 3
              $cordovaCamera.getPicture(options).then(function(imageData) {

                  // 4
                  onImageSuccess(imageData);

                  function onImageSuccess(fileURI) {
                      createFileEntry(fileURI);
                  }

                  function createFileEntry(fileURI) {
                      window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
                  }

                  // 5
                  function copyFile(fileEntry) {
                      var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                      var newName = makeid() + name;

                      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                              fileEntry.copyTo(
                                  fileSystem2,
                                  newName,
                                  onCopySuccess,
                                  fail
                              );
                          },
                          fail);
                  }

                  // 6
                  function onCopySuccess(entry) {
                      $scope.$apply(function() {
                          var name = entry.nativeURL.substr(entry.nativeURL.lastIndexOf('/') + 1);
                          $rootScope.imageURL = cordova.file.dataDirectory + name;
                      });
                  }

                  function fail(error) {
                      console.log("fail: " + error.code);
                  }

                  function makeid() {
                      var text = "";
                      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                      for (var i = 0; i < 5; i++) {
                          text += possible.charAt(Math.floor(Math.random() * possible.length));
                      }
                      return text;
                  }

              }, function(err) {
                  console.log(err);
              });
          };

          $scope.urlForImage = function(imageName) {
              var name = imageName.substr(imageName.lastIndexOf('/') + 1);
              var trueOrigin = cordova.file.dataDirectory + name;
              return trueOrigin;
          };
      }],
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
})
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
                  var scrollTop = (event.detail || event.originalEvent && event.originalEvent.detail).scrollTop;
                  // when scroll to top, we should always execute the immediate calculation.
                  // this is because of some weird problem which is hard to describe.
                  // if you want to experiment, always use the throttled one and just click on the page
                  // you will see all affix elements stacked on top
                  // if (scrollTop === 0) {
                      calculateScrollLimits(scrollTop);
                  // }
                  // else {
                  //     throttledCalculateScrollLimits(scrollTop);
                  // }

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
                  if (utils.position($container).top <= 0) {
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