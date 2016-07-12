class WGState {

    constructor(public $ionicHistory: ionic.navigation.IonicHistoryService, public $state: angular.ui.IStateService) {}

    public goWithoutAnimate(stateName: string): ng.IPromise<any> {

        this.$ionicHistory.nextViewOptions({
            historyRoot: true,
            disableBack: true,
            disableAnimate: true
        })
        return this.$state.go(stateName, {clear: true})
    }
    public clearCache() {
        this.$ionicHistory.clearCache();
    }
}

WGState.$inject = ["$ionicHistory", "$state"]
