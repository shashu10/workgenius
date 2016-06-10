/// <reference path="./login/login.ts" />
/// <reference path="./signup/signup.ts" />
/// <reference path="./welcome/welcome.ts" />

angular.module('wg.auth', ['parseData', 'wg.user'])

    .controller('WelcomeCtrl', WelcomeCtrl)

    .controller('SignupCtrl', SignupCtrl)

    .controller('LoginCtrl', LoginCtrl)