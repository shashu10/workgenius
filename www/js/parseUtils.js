angular.module('parseUtils', [])
    .factory('checkUpdates', ['$ionicPopup', checkUpdates])
    .factory('setupPush', ['$interval', setupPush])
    .factory('updateAppSettings', ['$rootScope', '$ionicPopup', 'checkUpdates', updateAppSettings]);

function setupPush($interval) {
    return function () {

        if (!window.parsePlugin) return; // Probably running in an emulator
        // first, lets initialize parse. fill in your parse appId and clientKey
        window.parsePlugin.initialize("cvvuPa7IqutoaMzFhVkULVPwYL6tI4dlCXa6UmGT", "bxecCnbiUnddzVbYkCeTVXuhPOzeOroXNHXTfvxG", function() {
            console.log('Parse initialized successfully.');

            window.parsePlugin.subscribe('worker', function() {
                console.log('Successfully subscribed to SampleChannel.');

                window.parsePlugin.getInstallationId(function(id) {
                    // update the view to show that we have the install ID
                    console.log('Retrieved install id: ' + id);

                    $interval(function() {
                        var query = new Parse.Query(Parse.Installation);
                        query.equalTo("installationId", id);
                        query.first({
                            success: function(object) {
                                // Successfully retrieved the object.
                                console.log('Success');
                                console.log(object);
                                    object.set('user', Parse.User.current());
                                    object.save({}, {
                                        success: function(object) {
                                            // The object was saved successfully.
                                            console.log('User saved in installation');
                                            console.log(object);
                                            // $rootScope.currentUser.set('allowNotifications', true);
                                            // $rootScope.currentUser.save({});
                                        },
                                        error: function(object, error) {
                                            console.log('error');
                                            Raven.captureException(error);
                                            console.log(error);
                                        }
                                    });
                            },
                            error: function(error) {
                                Raven.captureException(error);
                                console.log("Error: " + error.code + " " + error.message);
                            }
                        });
                    }, 5000, 1);

                }, function(e) {
                    Raven.captureException(e);
                    console.log('Failure to retrieve install id.');
                });

            }, function(e) {
                console.log('Failed trying to subscribe to SampleChannel.');
            });

        }, function(e) {
            Raven.captureException(e);
            console.log('Failure to initialize Parse Plugin.');
        });

    };
}
function checkUpdates($ionicPopup) {
    return function (currentVersion, appInfo, scope) {
        console.log('new app version: ' + appInfo.version);
        console.log(currentVersion);
        console.log(currentVersion < appInfo.version);
        scope.appInfo = appInfo;

        if (currentVersion < appInfo.version) {
            $ionicPopup.show({
                template: '<p ng-if="appInfo.features.length">New features in v{{appInfo.version}}</p><ul><li ng-repeat="feature in appInfo.features">- {{feature}}</li></ul>',
                title: 'App update available!',
                scope: scope,
                buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                    text: 'Later',
                    type: 'button-dark',
                    onTap: function(e) {
                        return false;
                    }
                }, {
                    text: 'Install',
                    type: 'button-positive',
                    onTap: function(e) {
                        return true;
                    }
                }]
            })
            // Using then closes the popup and 'Then' executes the following code
            .then(function(install) {
                // Pressed Install Button
                if (install) {
                    window.location = appInfo.url;
                }
            });
        }
    };
}

function updateAppSettings($rootScope, $ionicPopup, checkUpdates) {
    return function (currentVersion, platform) {
        return Parse.Cloud.run('getAppSettings', {platform: platform}, {
            success: function(appSettings) {
                $rootScope.appSettings = appSettings;
                $rootScope.availabilityLock = appSettings.availabilityLock;

                checkUpdates(currentVersion, appSettings.appInfo, $rootScope.$new());
            },
            error: function(error) {
                console.log('could not get settings');
                console.log(error);
            }
        });
    };
}