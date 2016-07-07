/// <reference path="./wg.data.eligibilities.ts" />

class WGCompany extends Parse.Object {

    // For tracking company application status, storing credentials, etc
    public eligibility: WGEligibility
    // Shows the detail view
    public showDetail: boolean

    constructor(eligibility: WGEligibility) {
        super('Company')
    }

    get name()               : string   { return this.get('name')}
    get employmentType()     : string   { return this.get('employmentType')}
    get bonusCondition()     : string   { return this.get('bonusCondition')}
    get requiredPages()      : string[] { return this.get('requiredPages')}
    get allowedVehicled()    : string[] { return this.get('allowedVehicled')}
    get availableLocations() : string[] { return this.get('availableLocations')}
    get order()              : number   { return this.get('recommendationOrder')}
    get bonusValue()         : number   { return this.get('bonusValue')}
    get payRangeLow()        : number   { return this.get('payRangeLow')}
    get payRangeHigh()       : number   { return this.get('payRangeHigh')}
    get peakDays()           : number   { return this.get('peakDays')}
    get peakTimes()          : number   { return this.get('peakTimes')}
    get earningsEst()        : number   { return this.get('earningsEst')}
    get availableNow()       : boolean  { return this.get('availableNow')}
    get interested()         : boolean  { return this.eligibility.interested}

    set interested(value: boolean) { this.eligibility.set('interested', value)}
}

class WGCompaniesService {

    public list: WGCompany[] = []
    public onDataReload = function() {}

    constructor(public $rootScope: ng.IRootScopeService,
                public currentUser: CurrentUserService,
                public wgEligibilities: WGEligibilitiesService) {
        Parse.Object.registerSubclass('Company', WGCompany)
    }

    get selected(): WGCompany[] { return _.filter(this.list, (c) => c.eligibility.interested) }

    get recommended(): WGCompany[] { return this.list.slice(0, 0) }

    get nonRecommended(): WGCompany[] { return this.list.slice(3) }

    // Union of all company requiredPages
    get requiredPages(): string[] {
        return _.reduce(this.selected, (req, c) => {
          return _.union(req, c.requiredPages);
        }, []);
    }

    get needsToLift(): boolean {
        return !!_.find(this.selected, function(o) { return o.name.toLowerCase() === 'clutter' });
    }

    public init() {

        this.fetchAllCompanies()

        .then((companies: WGCompany[]) => {
            // Create eligibilities for each company
            this.list = _.chain(companies)
            .sortBy((c) => c.order)
            .forEach((c) => this.setEmptyEligibility(c))
            .value()

            return this.wgEligibilities.fetchAll()
        })

        .then((eligibilities: WGEligibility[]) => {
            // Replace eligibilities if they exist for that user
            this.attachEligibilities(eligibilities)

            this.onDataReload()
        })
    }
    private setEmptyEligibility(company) {
        company.eligibility = new WGEligibility(this.currentUser.obj, company)
    }
    private attachEligibilities(eligibilities: WGEligibility[]) {
        _.forEach(eligibilities, (e) => {
            var found = _.find(this.list, function(company) { return company.name === e.company.name });
            found.eligibility = e
        })
    }

    private fetchAllCompanies(): Parse.Promise<any[]> {

        var query = new Parse.Query(WGCompany);
        query.greaterThan('recommendationOrder', 0);

        return query.find({

            success: (results) => results,
            error: (error) => {
                console.error("Could not get companies: " + error.code + " " + error.message);
                // TODO: Handle error here
                return [];
            }
        });
    }

    saveAll() {
        let companiesToSave = _.filter(this.list, (c) => {
            var el = c.eligibility
            // If eligibility exists, save new interested companies OR existing companies that have changed
            return el && (!el.existed() && el.interested) || (el.existed() && el.dirtyKeys().length)
        })
        let eligibilitiesToSave = _.map(companiesToSave, (c) => c.eligibility)

        Parse.Object.saveAll(eligibilitiesToSave)

        .then((results: WGEligibility[]) => {
            this.attachEligibilities(results)

        }, (error) => console.log(error))
    }
}

WGCompaniesService.$inject = ["$rootScope", "currentUser", "wgEligibilities"]
