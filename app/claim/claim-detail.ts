interface WGAvailableShiftDetail extends WGAvailableShift {
    claimText     : string
    claimMessage  : string
    claimStatus   : number
    conflict      : boolean
}
interface WGAvailableShiftGroupDetail extends WGAvailableShiftDetail {
    blitz         : boolean
    showBlitzInfo : boolean
    shifts        : WGAvailableShiftGroupDetail[]
    timeSlotStr   : string
}

class ClaimDetailCtrl {

    public shift: WGAvailableShiftDetail

    constructor(public $scope        : angular.IScope,
                public wgShifts      : WGShiftsService,
                public shiftToClaim  : ShiftToClaim,
                public $interval     : angular.IIntervalService,
                public $ionicHistory : ionic.navigation.IonicHistoryService,
                public $ionicScroll  : ionic.scroll.IonicScrollDelegate,
                public wgEarnings    : WGEarnings,
                public $state        : angular.ui.IStateService) {

            this.shift = this.shiftToClaim.get() as WGAvailableShiftDetail
            // When testing and refreshing page on localhost
            // If shiftToClaim dones't exist, go back to claim days
            if (_.isEmpty(this.shift)) {
                this.$ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: true
                })
                this.$state.go("app.claim-days")
                return
            }

            // If it was a conflict with a flex shift, reset it so user can try again
            if (this.shift.flex && this.shift.claimStatus === 3 && this.shift.conflict) {
                this.shift.claimStatus = 0
                this.shift.claimText = "Claim"
                this.shift.conflict = undefined
                this.shift.claimMessage = ""
            }
            var min = new Date(this.shift.startsAt) // create a a copy
            var max = new Date(this.shift.endsAt)   // create a a copy
            // Reset start and end times when going back to the claim shifts view
            this.$scope.$on('$ionicView.beforeLeave', () => {
                // If it was a conflict with a flex shift, reset it so user can try again
                if (this.shift.claimStatus === 0 || (this.shift.claimStatus === 3 && this.shift.conflict)) {
                    this.shift.startsAt = min
                    this.shift.endsAt = max
                }
            })

            // Keep claim status if already interracted with this element
            this.shift.claimStatus = this.shift.claimStatus || 0
            this.shift.claimText = this.shift.claimText || "Claim"

    }
    claim() {

        this.shift.claimStatus = 1
        this.shift.claimText = ""

        this.wgShifts.claim(this.shift as WGAvailableShift)
        .then(() => {

            mixpanel.track("Claimed Shift - " + this.shift.company)
            this.shift.claimStatus = 2
            this.shift.claimText = "Claimed Shift!"
            // If no user, then it's just a demo. Don't need to apply scope.

        }, (error) => {

            console.log(error)
            this.shift.claimStatus = 3
            this.shift.claimText = "Failed to claim"

            if (error && error.message === 'conflict') {
                this.shift.claimMessage = "There's a conflict! You are already working a shift at this time."
                this.shift.conflict = true
            } else
                this.shift.claimMessage = "Something went wrong. This shift may have already been claimed by someone else."

            // Scroll to the bottom to show error message
            this.$ionicScroll.scrollBottom(true)
        })
    }

}

ClaimDetailCtrl.$inject = ['$scope', 'wgShifts', 'shiftToClaim', '$interval', '$ionicHistory', '$ionicScrollDelegate', 'wgEarnings', '$state']

class ClaimGroupDetailCtrl {

    group: WGAvailableShiftGroupDetail

    constructor(public $scope        : angular.IScope,
                public wgShifts      : WGShiftsService,
                public shiftToClaim  : ShiftToClaim,
                public $interval     : angular.IIntervalService,
                public $ionicHistory : ionic.navigation.IonicHistoryService,
                public $ionicScroll  : ionic.scroll.IonicScrollDelegate,
                public wgEarnings    : WGEarnings,
                public $state        : angular.ui.IStateService) {

            // Shift Info
            this.group = shiftToClaim.get() as WGAvailableShiftGroupDetail

            // When testing and refreshing page on localhost
            // If shiftToClaim dones't exist, go back to claim days
            if (_.isEmpty(this.group)) {
                console.log("done")
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: true
                })
                $state.go("app.claim-days")
                return
            }

            this.group.showBlitzInfo = false

            _.forEach(this.group.shifts, (shift) => {

                // Set time string
                var start = moment(shift.startsAt)
                var end = moment(shift.endsAt)
                if (start.format('h') === '11')
                    shift.timeSlotStr = start.format('h a - ') + end.format('h a')
                else
                    shift.timeSlotStr = start.format('h - ') + end.format('h a')

                shift.claimStatus = shift.claimStatus || 0
                shift.claimText = shift.claimText || "Claim"

                if (shift.blitz) this.group.showBlitzInfo = true
            })
    }
    claim(s: WGAvailableShiftGroupDetail) {

        s.claimStatus = 1
        s.claimText = ""

        this.wgShifts.claim(s)

        .then(() => {

            mixpanel.track("Claimed Shift - " + s.company)
            s.claimStatus = 2
            s.claimText = "Claimed"
            // If no user, then it's just a demo. Don't need to apply scope.

        }, (error) => {

            console.log(error)
            s.claimStatus = 3
            s.claimText = "Failed"

            if (error && error.message === 'conflict') {
                s.claimMessage = "You have a conflict"
                s.conflict = true
            } else
                s.claimMessage = "Could not claim"
        })
    }
}

ClaimGroupDetailCtrl.$inject = ['$scope', 'wgShifts', 'shiftToClaim', '$interval', '$ionicHistory', '$ionicScrollDelegate', 'wgEarnings', '$state']
