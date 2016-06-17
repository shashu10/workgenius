/// <reference path="./wg.data.companies.ts" />
/// <reference path="./wg.data.vehicles.ts" />

angular.module('wg.data', [])

    .service('wgCompanies', WGCompanies)

    .service('wgVehicles', WGVehicles)