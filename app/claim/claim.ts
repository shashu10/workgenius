class ShiftToClaim {
    private _shift: WGAvailableShift
    constructor() {}

    get(): WGAvailableShift {return this._shift}
    set(shift: WGAvailableShift) {this._shift = shift}
}

class ClaimDaysCtrl {

    constructor(public $state       : angular.ui.IStateService,
                public $rootScope   : angular.IRootScopeService,
                public $interval    : angular.IIntervalService,
                public $ionicScroll : ionic.scroll.IonicScrollDelegate,
                public wgEarnings   : WGEarnings,
                public shiftToClaim : ShiftToClaim,
                public wgShifts     : WGShiftsService) {}

    doRefresh() {
        this.wgShifts.getAllAvailable()
        .then(() => {
            this.$ionicScroll.resize()
            this.$rootScope.$broadcast('scroll.refreshComplete')
        }, () => {
            this.$ionicScroll.resize()
            this.$rootScope.$broadcast('scroll.refreshComplete')
        })
    }

    toggleShifts(day) {
        // Toggle whether to show this day's detail view
        day.showShifts = !day.showShifts

        // hide other companies detail view
        _.forEach(this.wgShifts.available, (d) => {
            if (!_.isEqual(day, d) || !day.showShifts)
                d.showShifts = false
        })

        // Resize after accordion animation
        this.$interval(() => this.$ionicScroll.resize(), 100, 1)
    }

    select(shift) {
        this.shiftToClaim.set(shift)
        if (shift.groupedShift) 
            this.$state.go("app.claim-group-detail")
        else
            this.$state.go("app.claim-detail")
    }
}

ClaimDaysCtrl.$inject = ['$state', '$rootScope', '$interval', '$ionicScrollDelegate', 'wgEarnings', 'shiftToClaim', 'wgShifts']
