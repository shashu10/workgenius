class VehiclesCtrl {

    constructor(public $timeout: any, public $scope: any, public $state: any, public $ionicHistory: any, public currentUser: CurrentUser, public getUserData: any) {
        // this.currentUser.vehicles = 100;
    }

    next() {
        this.currentUser.save()
        this.$state.go('wizard-availability-days')
    }
}

VehiclesCtrl.$inject = ["$timeout", "$scope", "$state", "$ionicHistory", "currentUser", "getUserData"];