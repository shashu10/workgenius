/// <reference path="../../ts/wg.data.companies.ts" />

class CompaniesRecCtrl {

    public myCompanies: WGCompany[]
    public companies: WGCompany[]
    public recommended: WGCompany[]
    public nonRecommended: WGCompany[]

    constructor(public $ionicScrollDelegate: ionic.scroll.IonicScrollDelegate,
                public currentUser: CurrentUserService,
                public wgCompanies: WGCompaniesService,
                public ApplicationStates: ApplicationStatesService,
                public $interval: ng.IIntervalService,
                public connectPopup: ConnectPopupService) {

        this.loadCompanies()
        wgCompanies.RegisterOnLoadListener(() => this.loadCompanies())
        ApplicationStates.setApplicationCompleteListener(() => this.loadCompanies())
    }

    loadCompanies() {
        this.myCompanies = []
        this.recommended = []
        this.nonRecommended = []

        _.forEach(this.wgCompanies.list, (c) => {
            // Don't show companies that don't have a recommendation order
            if (!c.order) return

            if (c.connected || c.applied)
                this.myCompanies.push(c)
            else if (this.matchesLocation(c) && this.matchesVehicles(c) && c.isPartner)
                this.recommended.push(c)
            else
                this.nonRecommended.push(c)
        })
    }
    private matchesLocation(company: WGCompany) {
        const userLocs = _.map(this.currentUser.locations, (l) => l.name.toLowerCase())
        // If user has selected any vehicle required by company
        if (_.intersection(company.availableLocations, userLocs).length > 0) return true
    }
    private matchesVehicles(company: WGCompany) {
        const userVehicles = _.map(this.currentUser.selectedVehicles, (v) => v.toLowerCase())
        // If company doesn't require a vehicle, user is eligible to work for it
        if (_.find(company.requiredVehicles, (v) => v.toLowerCase() === "none")) return true
        // If user has selected any vehicle required by company
        if (_.intersection(company.requiredVehicles, userVehicles).length > 0) return true
    }

    next() {
        this.wgCompanies.saveAll()
        // start the application flow
        this.ApplicationStates.start()
    }

    toggleDetail(company: WGCompany) {
        // Toggle whether to show this company's detail view
        company.showDetail = !company.showDetail

        // hide other companies detail view
        _.forEach(this.wgCompanies.list, (c) => {
            if (!_.isEqual(company, c) || !company.interested)
                c.showDetail = false
        })

        // Resize after accordion animation
        this.$interval(() => this.resize(), 100, 1)
    }

    public connect(company) {
        this.connectPopup.show(company)
    }

    resize() { this.$ionicScrollDelegate.resize() }

    canContinue() {
        return _.filter(this.wgCompanies.list, (c) => c.interested).length
    }
    toggleConnectedCompany(name, toggle, username, password, success, failure) {
        // // If eligibility exists, get it. Else create new parse object
        // const el = get(name) || createEligibility(name);

        // // If unselecting parse object not in DB, just delete it
        // // Makes my life simpler with wg-save-bar
        // if (toggle === false && el.id === undefined)
        //     removeEligibility(name);

        // else {
        //     el.connected = toggle;
        //     el.username = username;
        //     el.password = password;
        // }
        // this.save(el, success, failure);
    }
}

CompaniesRecCtrl.$inject = ["$ionicScrollDelegate", "currentUser", "wgCompanies", "ApplicationStates", "$interval", "connectPopup"]


class CompanyDetail implements ng.IDirective {

    static instance(): ng.IDirective {
        return new CompanyDetail()
    }

    templateUrl = 'apply/companies/company-detail.html'
    restrict = 'E'
    scope = {
        companiesCtrl: '=',
        company: '='
    }
}

// .controller('ConnectAccountsCtrl', ['$scope', '$rootScope', '$ionicPopup',
//     function($scope, $rootScope, $ionicPopup) {

//         $scope.isEditing = false;

//         $scope.connect = function() {
//             if ($scope.connectPopup) {
//                 console.log($scope.connectPopup);
//                 $scope.connectPopup.close();
//                 $scope.connectPopup = null;
//             }
//             if ($scope.user.username && $scope.user.password) {
//                 eligibilities.toggleConnectedCompany(
//                     $scope.selectedCompany.name,
//                     true, // toggle value
//                     $scope.user.username,
//                     $scope.user.password,
//                     function success() {

//                         mixpanel.track("Connected company - " + $scope.selectedCompany.name);
//                         // Pulls up wg-save-bar
//                         if ($scope.wgSuccess) $scope.wgSuccess();
//                     },
//                     function failure(something) {

//                         mixpanel.track("Failed company connect - " + $scope.selectedCompany.name);
//                         $scope.selectedCompany.connected = false;
//                         if (Parse.User.current()) $scope.$apply();
//                         $ionicPopup.show(newFailurePopup());
//                         console.log('failure');
//                     });

//                 // Empty username/password
//             } else {
//                 $scope.selectedCompany.connected = false;
//             }
//         };
//         $scope.toggleConnection = function(company) {
//             $scope.selectedCompany = company;
//             // If toggle is turned on
//             if (company && company.connected) {
//                 $scope.isEditing = true;

//                 $scope.user = {};

//                 $scope.connectPopup = $ionicPopup.show();

//                 $scope.connectPopup.then(function(connect) {
//                     $scope.connectPopup = null;
//                     $scope.isEditing = false;

//                     // Pressed connect or hit enter/go on keyboard
//                     if (connect || connect === undefined) {
//                         $scope.connect(company);
//                         // Pressed never mind
//                     } else {
//                         company.connected = false;
//                     }
//                 });

//                 // If toggle is turned off
//             } else {
//                 // eligibilities.toggleConnectedCompany(company.name, false);
//             }
//         };

//         // Toggle connected/not connected for each company
//         for (const i = 0; i < $rootScope.companyList.length; i++) {
//             const company = $rootScope.companyList[i];
//             company.connected = isConnected(company.name);
//         }

//         function newFailurePopup() {
//             return {
//                 template: '<p>The username or password might be wrong</p>',
//                 title: 'Could not connect your account',
//                 scope: $scope,
//                 buttons: [{
//                     text: 'Ok',
//                     type: 'button-positive',
//                     onTap: function(e) {
//                         // Returning a value will cause the promise to resolve with the given value.
//                         return true;
//                     }
//                 }]
//             };
//         }


//         function isConnected(name) {
//             // const eligibility = eligibilities.get(name);
//             // return eligibility && eligibility.connected;
//         }
//     }
// ])