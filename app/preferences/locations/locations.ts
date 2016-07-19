class LocationsPreferenceCtrl {

    private otherOption = {selected: false, name: 'other', otherName: ''}
    private options: WGLocation[] = []
		
    public onChange:Function
    constructor(public currentUser: CurrentUserService, public debounce:WGDebounce, public alertDialog: AlertDialogService) {
        this.reset()
	this.onChange = function(city) {
		if (this.canContinue()) {
			this.save();
		}
	}
    }

    reset() {
        _.remove(this.options)
        Array.prototype.push.apply(this.options, [
            {selected: false, name: 'san francisco'},
            {selected: false, name: 'east bay'},
            {selected: false, name: 'south bay'},
            {selected: false, name: 'peninsula'},
            this.otherOption,
        ]);
	
	_.forEach(this.currentUser.locations,(location)=> {
		let found = _.find(this.options,(option) => option.name === location.name)
		if (found) {
			found.selected = true;
		}
	})
    }

    canContinue(): boolean {
        // If other is selected, the other name must be at least 2 characters long
        if (this.otherOption.selected) return (this.otherOption.otherName || "").length >= 2

        // At least one options must be selected
        return _.reduce(this.options, (result: boolean, value: WGLocation, key) => (result || value.selected), false);
    }



    loadUserlocations(locations: WGLocation[]) {
        _.forEach(locations, (l) => {
            _.forEach(this.options, (o) => {
                if (o.name.toLowerCase() === l.name.toLowerCase())
                    o.selected = true
            })
        })
    }

    save() {
        var toSave = _.chain(angular.copy(this.options))
        .filter((o) => o.selected)
        .forEach((o) => {delete o.selected})
        .value()

        this.currentUser.save ({
            locations: toSave
        })
    }
}

LocationsPreferenceCtrl.$inject = ["currentUser","debounce"];

