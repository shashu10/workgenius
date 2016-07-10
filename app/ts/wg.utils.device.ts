class WGDevice {

    constructor(public $cordovaDevice: ngCordova.IDeviceInfo) {}

    public getDeviceInfo() {
        var cordova = this.$cordovaDevice.cordova;
        var model = this.$cordovaDevice.model;
        var platform = this.$cordovaDevice.platform;
        var uuid = this.$cordovaDevice.uuid;
        var os_version = this.$cordovaDevice.version;
    }
}

WGDevice.$inject = ["$cordovaDevice", "$state"]
