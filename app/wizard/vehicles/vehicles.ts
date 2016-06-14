
interface vehicle {
    name: string
    icon: string
    selected: boolean
}

class VehiclesCtrl {

    private vehicles: vehicle[] = [
        { selected: false, name: 'Car', icon: 'ion-android-car' },
        { selected: false, name: 'Truck/Van', icon: 'ion-android-car' },
        { selected: false, name: 'Motorcycle', icon: 'ion-android-bicycle' },
        { selected: false, name: 'Scooter', icon: 'ion-android-bicycle' },
        { selected: false, name: 'Bicycle', icon: 'ion-android-bicycle' },
        { selected: false, name: 'None', icon: 'ion-android-cancel' },
    ]
    constructor(public $timeout: any, public $scope: any, public $state: any, public $ionicHistory: any, public currentUser: CurrentUser, public getUserData: any) {
    }

    next() {
        this.currentUser.save()
        this.$state.go('wizard-availability-days')
    }
}

VehiclesCtrl.$inject = ["$timeout", "$scope", "$state", "$ionicHistory", "currentUser", "getUserData"];