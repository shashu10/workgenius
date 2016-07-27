angular.module('parseUtils', [])
    .factory('setupPush', ['$interval', setupPush]);

function setupPush($interval) {
    return function () {

        if (!window.parsePlugin) return; // Probably running in an emulator
        // first, lets initialize parse. fill in your parse appId and clientKey
        window.parsePlugin.initialize(PARSE_APP_ID, PARSE_CLIENT_KEY, function() {
            console.log('Parse initialized successfully.');

            window.parsePlugin.getInstallationId(function(id) {
                // update the view to show that we have the install ID
                console.log('Retrieved install id: ' + id);

                $interval(function() {
                    var newInstall = new Parse.Installation();
                    newInstall.id = id;
                    newInstall.set('user', Parse.User.current());
                    newInstall.save()
                    .then(function(object) {
                        // The object was saved successfully.
                        console.log('User saved in installation');
                        // $rootScope.currentUser.set('allowNotifications', true);
                        // $rootScope.currentUser.save({});
                    }, function(object, error) {
                        console.log('error');
                        Raven.captureException(error);
                        console.log(error);
                    });
                }, 5000, 1);

            }, function(e) {
                Raven.captureException(e);
                console.log('Failure to retrieve install id.');
            });

        }, function(e) {
            Raven.captureException(e);
            console.log('Failure to initialize Parse Plugin.');
        });

    };
}
