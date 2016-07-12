class PreferencesCtrl {

    constructor(public currentUser: CurrentUserService,
                public wgState: WGState) {}

    logout() {
        this.currentUser.logOut()
        this.wgState.goWithoutAnimate('welcome')
        this.wgState.clearCache()
    }
}

PreferencesCtrl.$inject = ['currentUser', 'wgState']

angular.module('wg.preferences', [])

.controller('PreferencesCtrl', PreferencesCtrl)
