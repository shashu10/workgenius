/// <reference path="./applicationStates.service.ts" />
/// <reference path="./companies/company-recommendation.ts" />
/// <reference path="./phone/phone.ts" />
/// <reference path="./address/address.ts" />
/// <reference path="./weight/weight-limit.ts" />
/// <reference path="./car/car-info.ts" />
/// <reference path="./documents/documents.ts" />
/// <reference path="./documents/documents.ts" />
/// <reference path="./headshot/headshot.ts" />
/// <reference path="./background/bg-info.ts" />
/// <reference path="./background/bg-ssn.ts" />
/// <reference path="./phone-call/phone-call.ts" />
/// <reference path="./finish/finish.ts" />

angular.module('wg.apply', ['wg.user', 'parseData'])

    .service('ApplicationStates', ApplicationStatesService)

    .controller('CompaniesRecCtrl', CompaniesRecCtrl)

    .controller('PhoneCtrl', PhoneCtrl)

    .controller('AddressCtrl', AddressCtrl)

    .controller('WeightLimitCtrl', WeightLimitCtrl)

    .controller('CarInfoCtrl', CarInfoCtrl)

    .controller('DocumentsCtrl', DocumentsCtrl)

    .controller('HeadshotCtrl', HeadshotCtrl)

    .controller('BackgroundCheckInfoCtrl', BackgroundCheckInfoCtrl)

    .controller('BackgroundCheckSSNCtrl', BackgroundCheckSSNCtrl)

    .controller('PhoneCallCtrl', PhoneCallCtrl)

    .controller('FinishCtrl', FinishCtrl)

    .directive('companyDetail', CompanyDetail.instance)