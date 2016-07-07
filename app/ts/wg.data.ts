/// <reference path="./wg.data.companies.ts" />
/// <reference path="./wg.data.eligibilities.ts" />
/// <reference path="./wg.data.manager.ts" />

angular.module('wg.data', [])

    .service('wgCompanies', WGCompaniesService)

    .service('wgEligibilities', WGEligibilitiesService)

    .service('wgDataManager', WGDataManagerService)