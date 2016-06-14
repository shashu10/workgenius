class GoalCtrl {

    constructor(public $timeout: any, public $scope: any, public $state: any, public $ionicHistory: any, public currentUser: CurrentUser, public getUserData: any) {
        this.currentUser.goal = 100;
    }

    next() {
        this.currentUser.save()
        this.$state.go('wizard-locations')
    }
}

GoalCtrl.$inject = ["$timeout", "$scope", "$state", "$ionicHistory", "currentUser", "getUserData"];