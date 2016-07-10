angular.module('parseUtils', [])
    .factory('setupPush', ['$interval', setupPush])
    .factory('getCompanyEligibility', ['$rootScope', getCompanyEligibility])

function getCompanyEligibility($rootScope) {
    return function (name) {
        var el = $rootScope.currentUser.eligibility;
        for (var i = 0; i < el.length; i++) {
            if (name === el[i].company) {
                return el[i];
            }
        }
        return undefined;  
    };
}
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
                                console.log('Parse.Installation');
                                console.log(object);
                                    object.set('user', Parse.User.current());
                                    object.save({}, {
                                        success: function(object) {
                                            // The object was saved successfully.
                                            console.log('User saved in installation');
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
