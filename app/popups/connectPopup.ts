interface ConnectUser {
    username: string
    password: string
}

class ConnectPopupService {

    private connectPopup: ionic.popup.IonicPopupPromise
    private isEditing: boolean
    private company: WGCompany
    private user: ConnectUser

    constructor(public $ionicPopup: ionic.popup.IonicPopupService,
                public $rootScope: ng.IRootScopeService,
                public wgEligibilities: WGEligibilitiesService,
                public alertDialog: AlertDialogService) {}

    show(company: WGCompany) {
        this.company = company
        this.user = {username: "", password: ""}
        this.connectPopup = this.$ionicPopup.show(this.newConnectPopup())

        this.connectPopup.then((connect) => {
            this.connectPopup = null
            this.isEditing = false

            // Pressed connect or hit enter/go on keyboard
            if (connect || connect === undefined) {
                this.connect()
                // Pressed never mind
            } else {
                // do not connect
            }
        })
    }

    private newConnectPopup() {
        const scope = this.$rootScope.$new(true) as ConnectPopupScope
        scope.user = this.user
        scope.company = this.company

        let connectTitle = `Enter your ${_.capitalize(this.company.name)} login`
        if (!_.isEmpty(this.company.connectInfo)) connectTitle = this.company.connectInfo.title

        return {
            templateUrl: 'popups/connect_popup.html',
            title: connectTitle,
            scope: scope,
            cssClass: 'connect-popup',
            buttons: [{
                text: 'Never Mind',
                type: 'button-dark',
                // Returning a value will cause the promise to resolve with the given value.
                onTap: (e) => false
            }, {
                text: 'Connect',
                type: 'button-positive',
                // Returning a value will cause the promise to resolve with the given value.
                onTap: (e) => true
            }]
        }
    }
    private newFailurePopup() {
        return {
            template: '<p>The username or password might be wrong</p>',
            title: 'Could not connect your account',
            buttons: [{
                text: 'Ok',
                type: 'button-positive',
                // Returning a value will cause the promise to resolve with the given value.
                onTap: (e) => true
            }]
        };
    }
    private connect(): Parse.IPromise<any> {

        if (this.connectPopup) {
            this.connectPopup.close()
            this.connectPopup = undefined
        }

        if (this.user.username && this.user.password) {

            return this.wgEligibilities.connect(this.company, this.user)
            .then(() => {
                console.log("success")
                this.alertDialog.alert(AlertColor.success, 'Connected!')
                return Parse.Promise.as("")

            }, (error = {}) => {
                let message = 'Check username/password'
                if (error.code === 100) message = 'No internet'

                this.alertDialog.alert(AlertColor.failure, message)
                return Parse.Promise.error("")
            })

        // Empty username/password
        } else return Parse.Promise.error("")
    }
}

interface ConnectPopupScope extends ng.IScope {
    company: WGCompany
    user: {
        username: string
        password: string
    }
}

ConnectPopupService.$inject = ["$ionicPopup", "$rootScope", "wgEligibilities", "alertDialog"]

angular.module('wg.popups', [])

    .service('connectPopup', ConnectPopupService)
