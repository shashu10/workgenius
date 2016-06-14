
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
    constructor(public $state: any, public currentUser: CurrentUser, public WizardStates: any) {}

    next() {
        this.currentUser.save()
        this.WizardStates.next()
    }
}

VehiclesCtrl.$inject = ["$state", "currentUser", "WizardStates"];