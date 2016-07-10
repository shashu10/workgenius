class WGState {

    constructor(public $ionicHistory: ionic.navigation.IonicHistoryService, public $state: angular.ui.IStateService) {}

    public goWithoutAnimate(name: string): ng.IPromise<any> {

        this.$ionicHistory.nextViewOptions({
            historyRoot: true,
            disableBack: true,
            disableAnimate: true
        })
        return this.$state.go(name, {clear: true})
    }
}

WGState.$inject = ["$ionicHistory", "$state"]
