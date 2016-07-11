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
    get description()        : string   { return this.get('description')}
    get employmentType()     : string   { return this.get('employmentType')     || ''}
    get bonusCondition()     : string   { return this.get('bonusCondition')     || ''}
    get requiredPages()      : string[] { return this.get('requiredPages')      || []}
    get requiredVehicles()   : string[] { return _.map(this.get('requiredVehicles')   || [], (v: string) => v.toLowerCase())}
    get availableLocations() : string[] { return _.map(this.get('availableLocations') || [], (v: string) => v.toLowerCase())}
    get order()              : number   { return this.get('recommendationOrder')}
    get bonusValue()         : number   { return this.get('bonusValue')}
    get payRangeLow()        : number   { return this.get('payRangeLow')}
    get payRangeHigh()       : number   { return this.get('payRangeHigh')}
    get peakDays()           : number   { return this.get('peakDays')}
    get peakTimes()          : number   { return this.get('peakTimes')}
    get earningsEst()        : number   { return this.get('earningsEst')}
    get availableNow()       : boolean  { return this.get('availableNow')}
    get isPartner()          : boolean  { return this.get('isPartner')}
    get interested()         : boolean  { return this.eligibility.interested}

    set interested(value: boolean) { this.eligibility.set('interested', value)}
}

class WGCompaniesService {

    public list: WGCompany[] = []
    public onDataReload = function() {}

    constructor(public $rootScope: ng.IRootScopeService,
                public wgEligibilities: WGEligibilitiesService) {
        Parse.Object.registerSubclass('Company', WGCompany)
    }

    get selected(): WGCompany[] { return _.filter(this.list, (c) => c.eligibility.interested) }

    // Union of all company requiredPages
    get requiredPages(): string[] {
        return _.reduce(this.selected, (req, c) => {
          return _.union(req, c.requiredPages);
        }, []);
    }

    public init() {}

    public load() {

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
        company.eligibility = new WGEligibility(company)
    }
    private attachEligibilities(eligibilities: WGEligibility[]) {
        _.forEach(eligibilities, (e) => {
            var found = _.find(this.list, function(company) { return company.name === e.company.name });
            if (found) found.eligibility = e
        })
    }

    private fetchAllCompanies(): Parse.Promise<any[]> {

        var query = new Parse.Query(WGCompany);
        // query.greaterThan('recommendationOrder', 0);

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

WGCompaniesService.$inject = ["$rootScope", "wgEligibilities"]
