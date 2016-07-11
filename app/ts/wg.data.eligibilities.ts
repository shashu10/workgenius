// Makes it easy to keep track of eligibilities
class WGEligibility extends Parse.Object {

    constructor(worker: Parse.User, company: WGCompany, interested = false) {
        super('Eligibility')

        this.worker = worker
        this.company = company
        this.interested = interested
    }

    get interested(): boolean { return this.get('interested') }
    set interested(interested: boolean) { this.set('interested', interested) }

    // get worker(): Parse.User { return this.get('worker') }
    set worker(worker: Parse.User) { this.set('worker', worker) }

    get company(): WGCompany { return this.get('company') }
    set company(company: WGCompany) { this.set('company', company) }

    get token()    : string { return this.get('company') }
    get workerId() : string { return this.get('workerId') }
}

class WGEligibilitiesService {

    public list: WGEligibility[] = []

    constructor(public $rootScope: ng.IRootScopeService) {
        Parse.Object.registerSubclass('Eligibility', WGEligibility)
    }

    getCompanyEligibility(name: string): WGEligibility {
        return _.find(this.list, (el) => el.company.name === name)
    }

    fetchAll(): Parse.Promise<any[]> {

        var query = new Parse.Query(WGEligibility)
        query.equalTo('worker', Parse.User.current())
        query.include('company')

        return query.find({

            success: (results) => results,
            error: (error) => {
                console.error("Could not get eligibilities: " + error.code + " " + error.message)
                // handle Error
                return []
            }
        })
    }
}

WGEligibilitiesService.$inject = ["$rootScope"]
