class ProfileCtrl {

    constructor(public currentUser: CurrentUserService,
                public wgState: WGState) {}
}

ProfileCtrl.$inject = ['currentUser', 'wgState']

angular.module('wg.profile', [])

.controller('ProfileCtrl', ProfileCtrl)
