class ConnectPopupService {

    private connectPopup: any

    constructor(public $ionicPopup: ionic.popup.IonicPopupService,
                public $rootScope: ng.IRootScopeService) {}

    show(company: WGCompany) {

        this.connectPopup = this.$ionicPopup.show(this.newConnectPopup())

        this.connectPopup.then((connect) => {
            this.connectPopup = null
            // this.isEditing = false

            // Pressed connect or hit enter/go on keyboard
            if (connect || connect === undefined) {
                // this.connect(company)
                // Pressed never mind
            } else {
                // company.connected = false
            }
        })
    }

    newConnectPopup() {
        var scope = this.$rootScope.$new(true) as ConnectPopupScope
        scope.user = {
            username: "",
            password: ""
        }

        return {
            templateUrl: 'popups/connect_popup.html',
            title: 'Enter your company login',
            scope: scope,
            cssClass: 'connect-popup',
            buttons: [{
                text: 'Never Mind',
                type: 'button-dark',
                onTap: function(e) {
                    // Returning a value will cause the promise to resolve with the given value.
                    return false
                }
            }, {
                    text: 'Connect',
                    type: 'button-positive',
                    onTap: function(e) {
                        // Returning a value will cause the promise to resolve with the given value.
                        return scope.user
                    }
                }]
        }
    }
}

interface ConnectPopupScope extends ng.IScope {
    user: {
        username: string
        password: string
    }
}

ConnectPopupService.$inject = ["$ionicPopup", "$rootScope"]

angular.module('wg.popups', [])

    .service('connectPopup', ConnectPopupService)
