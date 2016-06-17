class WGCompany extends Parse.Object {

    constructor() {
        super('Company');
    }

    // If user wants to onboard with the company
    // Don't save this settings on the company
    public interested: boolean

    get name(): string { return this.get('name') }
    set name(name: string) { this.set('name', name) }

    get earningsEst(): number { return this.get('earningsEst') }
    set earningsEst(earningsEst: number) { this.set('earningsEst', earningsEst) }

    // order in which it will appear in onboarding
    get order(): number { return this.get('recommendationOrder') }
    set order(order: number) { this.set('recommendationOrder', order) }

    // If not available now don't show anywhere
    get availableNow(): boolean { return this.get('availableNow') }
    set availableNow(availableNow: boolean) { this.set('availableNow', availableNow) }

    // W2/1099
    get employmentType(): string { return this.get('employmentType') }
    set employmentType(employmentType: string) { this.set('employmentType', employmentType) }
}

class WGCompanies {

    public companies: WGCompany[] = []

    constructor(public $rootScope: any) {
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

                console.log("Successfully got companies")
            },
            error: function(error) {
                console.error("Could not get companies: " + error.code + " " + error.message);
            }
        });
    }
}

WGCompanies.$inject = ["$rootScope"]