// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/14fe4313f4a1cf69add3505a2ab1dbc690dc2116/ng-cordova/camera.d.ts
declare namespace ngCordova {
    export interface ICameraService {
        getPicture(options?: CameraOptions): ng.IPromise<string>;
        cleanup(): ng.IPromise<void>;
    }
}