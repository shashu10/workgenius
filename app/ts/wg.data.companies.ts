class WGCompany extends Parse.Object {

    constructor() {
        super('Company');
    }

    // If user wants to onboard with the company
    // Don't save this settings on the company
    public interested: boolean
    // Shows the detail view
    public showDetail: boolean

    // order in which it will appear in onboarding
    get order(): number { return this.get('recommendationOrder') }

    // If not available now don't show anywhere
    get availableNow(): boolean { return this.get('availableNow') }

    get name()           : string { return this.get('name')}
    get employmentType() : string { return this.get('employmentType')}
    get requirements()   : string { return this.get('requirements')}
    get bonusCondition() : string { return this.get('bonusCondition')}
    get bonusValue()     : number { return this.get('bonusValue')}
    get payRangeLow()    : number { return this.get('payRangeLow')}
    get payRangeHigh()   : number { return this.get('payRangeHigh')}
    get peakDays()       : number { return this.get('peakDays')}
    get peakTimes()      : number { return this.get('peakTimes')}
    get earningsEst()    : number { return this.get('earningsEst')}
}

class WGCompaniesService {

    public companies: WGCompany[] = []
    private reloadCallback: Function

    constructor(public $rootScope: ng.IRootScopeService) {
        Parse.Object.registerSubclass('Company', WGCompany);
    }

    get selected(): WGCompany[] {
        return _.filter(this.companies, (c) => c.interested)
    }

    get recommended(): WGCompany[] {
        return this.companies.slice(0, 3)
    }

    get nonRecommended(): WGCompany[] {
        return this.companies.slice(3)
    }

    needsToLift(): boolean {
        return !!_.find(this.selected, function(o) { return o.name.toLowerCase() === 'clutter' });
    }

    setOnReloadCallback(callback: Function) {
        this.reloadCallback = callback
    }

    fetchAll() {

        var query = new Parse.Query(WGCompany);

        query.find({

            success: (results: WGCompany[]) => {

                this.companies = 

                _.chain(results)
                .filter((c) => !!c.order)
                .sortBy((c) => c.order)
                .value();

                this.$rootScope.$apply()

                if (this.reloadCallback) this.reloadCallback()

                console.log("Successfully got companies")
            },
            error: function(error) {
                console.error("Could not get companies: " + error.code + " " + error.message);
            }
        });
    }
}

WGCompaniesService.$inject = ["$rootScope"]