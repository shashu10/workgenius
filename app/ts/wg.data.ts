/// <reference path="./wg.data.companies.ts" />
/// <reference path="./wg.data.eligibilities.ts" />
/// <reference path="./wg.data.manager.ts" />
/// <reference path="./wg.data.shifts.ts" />

angular.module('wg.data', [])

    .service('wgShifts', WGShiftsService)

    .service('wgCompanies', WGCompaniesService)

    .service('wgEligibilities', WGEligibilitiesService)

    .service('wgDataManager', WGDataManagerService)
