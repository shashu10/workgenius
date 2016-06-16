
interface vehicle {
    name: string
    icon: string
    selected: boolean
}

class VehiclesCtrl {

    private vehicles: vehicle[] = [
        { selected: false, name: 'Car', icon: 'wg-icon-car' },
        { selected: false, name: 'Truck/Van', icon: 'wg-icon-truck' },
        { selected: false, name: 'Motorcycle', icon: 'wg-icon-motorcycle' },
        { selected: false, name: 'Scooter', icon: 'wg-icon-scooter' },
        { selected: false, name: 'Bicycle', icon: 'wg-icon-bicycle' },
        { selected: false, name: 'None', icon: 'wg-icon-none' },
    ]
    constructor(public $state: any, public currentUser: CurrentUser, public WizardStates: any) {}

    next() {
        this.currentUser.save()
        this.WizardStates.next()
    }
}

VehiclesCtrl.$inject = ["$state", "currentUser", "WizardStates"];