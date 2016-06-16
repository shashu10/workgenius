class WGCompany extends Parse.Object {

    constructor() {
        super('Company');
    }
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

    // If user wants to onboard with them
    get interested(): boolean { return this.get('interested') }
    set interested(interested: boolean) { this.set('interested', interested) }

    // W2/1099
    get employmentType(): string { return this.get('employmentType') }
    set employmentType(employmentType: string) { this.set('employmentType', employmentType) }
}

Parse.Object.registerSubclass('Company', WGCompany);

class WGCompanies {

    public companies: WGCompany[] = []

    constructor(public $rootScope: any) {}

    get recommended(): WGCompany[] {
        return this.companies.slice(0, 3)
    }

    get nonRecommended(): WGCompany[] {
        return this.companies.slice(3)
    }

    fetchAll() {

        var query = new Parse.Query(WGCompany);

        query.find({

            success: (results: WGCompany[]) => {

                this.companies = _.sortBy(results, (c) => c.order);

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