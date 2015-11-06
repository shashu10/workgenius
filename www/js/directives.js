angular.module('workgenius.directives', [])

.directive('days', function() {
  return {
    templateUrl: 'templates/shared/days.html'
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
.directive('customSubheader', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(function() {
        // Add 44px because this is the height of the header
        console.log('test');
        var height = element[0].offsetHeight + element[0].offsetTop;
        
        // Get the ion-content element containing has-subheader
        var content = angular.element(document.querySelector('.has-subheader'));

        content.css("top", height + "px");
      });
    }
  }
})
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
});