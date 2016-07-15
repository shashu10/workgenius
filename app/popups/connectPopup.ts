class ConnectPopupService {

    private connectPopup: ionic.popup.IonicPopupPromise
    private isEditing: boolean 

    constructor(public $ionicPopup: ionic.popup.IonicPopupService,
                public $rootScope: ng.IRootScopeService) {}

    show(company: WGCompany) {

        this.connectPopup = this.$ionicPopup.show(this.newConnectPopup())

        this.connectPopup.then((connect) => {
            this.connectPopup = null
            this.isEditing = false

            // Pressed connect or hit enter/go on keyboard
            if (connect || connect === undefined) {
                this.connect(company)
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
    connect(user: any) {
        if (this.connectPopup) {
            this.connectPopup.close()
            this.connectPopup = undefined
        }
        // if (user.username && user.password) {
        //     eligibilities.toggleConnectedCompany(
        //         this.selectedCompany.name,
        //         true, // toggle value
        //         user.username,
        //         user.password,
        //         function success() {

        //             mixpanel.track("Connected company - " + this.selectedCompany.name)
        //             // Pulls up wg-save-bar
        //             if (this.wgSuccess) this.wgSuccess()
        //         },
        //         function failure(something) {

        //             mixpanel.track("Failed company connect - " + this.selectedCompany.name)
        //             this.selectedCompany.connected = false
        //             if (Parse.User.current()) this.$apply()
        //             $ionicPopup.show(newFailurePopup())
        //             console.log('failure')
        //         })

        //     // Empty username/password
        // } else {
        //     this.selectedCompany.connected = false
        // }
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
