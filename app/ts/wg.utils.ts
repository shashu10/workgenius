/// <reference path="./wg.utils.image.ts" />
/// <reference path="./wg.utils.state.ts" />
/// <reference path="./wg.utils.device.ts" />
/// <reference path="./wg.utils.earnings.ts" />

angular.module('wg.utils', [])

    .service('wgImage', WGImage)

    .service('wgState', WGState)

    .service('wgDevice', WGDevice)

    .service('wgEarnings', WGEarnings)
