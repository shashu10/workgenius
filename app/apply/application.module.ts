/// <reference path="./applicationStates.service.ts" />
/// <reference path="./companies/company-recommendation.ts" />
/// <reference path="./phone/phone.ts" />
/// <reference path="./address/address.ts" />
/// <reference path="./lift/lift.ts" />
/// <reference path="./car/car-info.ts" />
/// <reference path="./car/car-documents.ts" />
/// <reference path="./car/car-documents.ts" />
/// <reference path="./headshot/headshot.ts" />
/// <reference path="./background/background-check-info.ts" />
/// <reference path="./background/background-check-ssn.ts" />

angular.module('wg.apply', ['wg.user', 'parseData'])

    .service('ApplicationStates', ApplicationStatesService)

    .controller('CompaniesRecCtrl', CompaniesRecCtrl)

    .controller('PhoneCtrl', PhoneCtrl)

    .controller('AddressCtrl', AddressCtrl)

    .controller('LiftCtrl', LiftCtrl)

    .controller('CarInfoCtrl', CarInfoCtrl)

    .controller('CarDocumentsCtrl', CarDocumentsCtrl)

    .controller('HeadshotCtrl', HeadshotCtrl)

    .controller('BackgroundCheckInfoCtrl', BackgroundCheckInfoCtrl)

    .controller('BackgroundCheckSSNCtrl', BackgroundCheckSSNCtrl)
