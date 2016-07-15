class ProfileCtrl {

    constructor(public currentUser: CurrentUserService,
                public wgState: WGState) {}

    logout() {
        this.currentUser.logOut()
        this.wgState.goWithoutAnimate('welcome')
        this.wgState.clearCache()
    }
}

ProfileCtrl.$inject = ['currentUser', 'wgState']

angular.module('wg.profile', [])

.controller('ProfileCtrl', ProfileCtrl)
