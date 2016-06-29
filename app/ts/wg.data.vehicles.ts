class WGVehicle extends Parse.Object {

    constructor(worker: Parse.User, type: string, selected?: boolean) {
        super('Vehicle');

        this.selected = selected
        this.worker = worker
        this.type = type
        this.icon = this._icons[type]
    }

    private _icons = {
        'Car': 'wg-icon-car',
        'Truck/Van': 'wg-icon-truck',
        'Motorcycle': 'wg-icon-motorcycle',
        'Scooter': 'wg-icon-scooter',
        'Bicycle': 'wg-icon-bicycle',
        'None': 'wg-icon-none',
    }

    get icon(): string { return this._icons[this.type] }

    get selected(): boolean { return this.get('selected') }
    set selected(selected: boolean) { this.set('selected', selected) }

    get type(): string { return this.get('type') }
    set type(type: string) { this.set('type', type) }

    get worker(): Parse.User { return this.get('worker') }
    set worker(worker: Parse.User) { this.set('worker', worker) }

    get make(): string { return this.get('make') }
    set make(make: string) { this.set('make', make) }

    get model(): string { return this.get('model') }
    set model(model: string) { this.set('model', model) }

    get year(): number { return this.get('year') }
    set year(year: number) { this.set('year', year) }
}

class WGVehiclesService {

    public list: WGVehicle[] = []

    constructor(public $rootScope: ng.IRootScopeService, public currentUser: CurrentUserService) { }

    init() {
        this.list = [
            new WGVehicle(this.currentUser.obj, 'Car'),
            new WGVehicle(this.currentUser.obj, 'Truck/Van'),
            new WGVehicle(this.currentUser.obj, 'Motorcycle'),
            new WGVehicle(this.currentUser.obj, 'Scooter'),
            new WGVehicle(this.currentUser.obj, 'Bicycle'),
            new WGVehicle(this.currentUser.obj, 'None'),
        ]

        Parse.Object.registerSubclass('Vehicle', WGVehicle);

        this.fetchAll()
    }

    get carIsSelected(): boolean { return _.find(this.list, (v) => v.type === 'Car').selected }

    fetchAll() {

        var query = new Parse.Query(WGVehicle);
        query.equalTo('worker', Parse.User.current())
        query.find({

            success: (results: WGVehicle[]) => {
                this.updateLocalList(results)
            },
            error: function(error) {
                console.error("Could not get vehicles: " + error.code + " " + error.message);
            }
        });
    }
    saveAll() {
        let toSave = _.filter(this.list, (v) => {
            // Save new selected vehicles OR existing vehiles that have changed
            return (!v.existed() && v.selected) || (v.existed() && v.dirtyKeys().length)
        })

        Parse.Object.saveAll(toSave)

        .then((results: WGVehicle[]) => {
            this.updateLocalList(results)

        }, (error) => {
            console.log(error)
        })
    }

    // Update local list with results
    updateLocalList(results: WGVehicle[]) {
        _.forEach(results, (v) => {

            // Find item index using indexOf+find
            var index = _.indexOf(this.list, _.find(this.list, { type: v.type }));

            // Replace item at index using native splice
            this.list.splice(index, 1, v);
        })

        // UI update not necessary
        // this.$rootScope.$apply()
    }
}

WGVehiclesService.$inject = ["$rootScope", "currentUser"]
