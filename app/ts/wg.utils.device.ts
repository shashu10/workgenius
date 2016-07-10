declare var IS_TESTING

class WGDevice {

    constructor(public $rootScope: angular.IRootScopeService,
                public $cordovaDevice: ngCordova.IDeviceService,
                public $cordovaAppVersion: ngCordova.IAppVersionService,
                public updateAppSettings: any,
                public ios_modes_map: any,
                public android_modes_map: any) {}

    public trackDevice() {

        // Setup variables used through out the app
        this.$rootScope['device'] = {};
        this.$rootScope['appVersion'] = "9.9.9";

        if (IS_TESTING) return this.updateAppSettings("1.1.1", "");

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

WGDevice.$inject = ["$rootScope", "$cordovaDevice", "$cordovaAppVersion", "updateAppSettings", "ios_modes_map", "android_modes_map"]
