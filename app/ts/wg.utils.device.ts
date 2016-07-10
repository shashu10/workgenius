declare var IS_TESTING

class WGDevice {

    constructor(public $rootScope: angular.IRootScopeService,
                public $ionicPopup: ionic.popup.IonicPopupService,
                public $cordovaDevice: ngCordova.IDeviceService,
                public $cordovaAppVersion: ngCordova.IAppVersionService,
                public ios_modes_map: any,
                public android_modes_map: any) {}

    public trackDevice() {

        // Setup variables used through out the app

        if (IS_TESTING) return

        this.$cordovaAppVersion.getVersionNumber()
        .then((version) => {
            this.trackNewAppVersion(version);

            var platform = this.$cordovaDevice.getPlatform().toLowerCase();

            this.$rootScope['device'] = {
                os_version: this.$cordovaDevice.getVersion(),
                platform: this.$cordovaDevice.getPlatform(),
                cordova: this.$cordovaDevice.getCordova(),
                model: this.$cordovaDevice.getModel(),
                uuid: this.$cordovaDevice.getUUID(),
            }

            // Converts device name to human readable form eg: "iPhone7,2" to "iPhone 6"
            if (platform === 'ios')     this.$rootScope['device'].model = this.ios_modes_map[device.model] || device.model;
            if (platform === 'android') this.$rootScope['device'].model = this.android_modes_map[device.model] || device.model;

            this.$rootScope['prefilledDevice'] = true;

            this.updateAppSettings(version, platform);
        });
    }

    private updateAppSettings(currentVersion: string, platform: string) {

        // Manual update for binary changes
        return Parse.Cloud.run('getAppSettings', {platform: platform})

        .then((appSettings : any) => {
            this.checkUpdates(currentVersion, platform, appSettings.appInfo, this.$rootScope.$new());

        }, (error) => {
            console.log('could not get settings');
            console.log(error);
        });
    }
    private checkUpdates (currentVersion: string, platform: string, appInfo, scope: ng.IScope) {
        // console.log('Current version: ' + currentVersion);
        // console.log('new app version: ' + appInfo.version);
        scope['appInfo'] = appInfo;

        if (currentVersion < appInfo.version) {
            this.$ionicPopup.show({
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
                    // Uses the device browser because android sucks and won't download the app
                    window.open(appInfo.url, '_system');
                }
            });
        }
    }
    private trackNewAppVersion(version) {
        this.$rootScope['appVersion'] = version;
        // update app version in sentry and mixpanel
        var rvContext = Raven.getContext();
        rvContext = (rvContext && rvContext.user) || {};
        rvContext.appVersion = version;
        Raven.setUserContext(rvContext);
        mixpanel.people.set({"appVersion": version});
    }
}

WGDevice.$inject = ["$rootScope", "$ionicPopup", "$cordovaDevice", "$cordovaAppVersion", "ios_modes_map", "android_modes_map"]
