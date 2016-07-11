// Makes it easy to keep track of eligibilities
class WGEligibility extends Parse.Object {

    constructor(worker: Parse.User, company: WGCompany, interested = false) {
        super('Eligibility')

        this.worker = worker
        this.company = company
        this.interested = interested
    }

    public refresher: any

    get interested(): boolean { return this.get('interested') }
    set interested(interested: boolean) { this.set('interested', interested) }

    // get worker(): Parse.User { return this.get('worker') }
    set worker(worker: Parse.User) { this.set('worker', worker) }

    get company(): WGCompany { return this.get('company') }
    set company(company: WGCompany) { this.set('company', company) }

    get token()    : string { return this.get('token') }
    get workerId() : string { return this.get('workerId') }

    set tokenRefreshedAt(date: Date) { this.set('tokenRefreshedAt', date) }
    get tokenRefreshedAt() : Date    { return this.get('tokenRefreshedAt') }

    refreshToken() {

        if (!Parse.User.current()) return

        // Expired
        Parse.Cloud.run('refreshToken', {eligibilityId : this.id})
        .then((result: any) => {
            console.log(result)
            this.token = result.token
            this.tokenRefreshedAt = result.tokenRefreshedAt

        },
        (error) => {
            console.log('Could not refresh token')
            console.log(error)
        })
    }
}

class WGEligibilitiesService {

    public list: WGEligibility[] = []

    constructor(public $rootScope: ng.IRootScopeService,
                public $interval: angular.IIntervalService) {
        Parse.Object.registerSubclass('Eligibility', WGEligibility)
    }

    getCompanyEligibility(name: string): WGEligibility {
        return _.find(this.list, (el) => el.company.name === name)
    }

    startRefreshTimers() {
        _.forEach(this.list, (el) => {
            var duration: number

            if (el.company.name === 'doordash')       duration = 3 * 60 * 60 * 1000
            else if (el.company.name === 'postmates') duration = 12 * 60 * 60 * 1000

            if (duration) {
                if (el.refresher) this.$interval.cancel(el.refresher)

                el.refresher = this.$interval(() => {
                    el.refreshToken()
                }, duration)
            }
        })
    }
    fetchAll(): Parse.Promise<any[]> {

        var query = new Parse.Query(WGEligibility)
        query.equalTo('worker', Parse.User.current())
        query.include('company')

        return query.find({

            success: (results) => {
                this.startRefreshTimers()
                return results

            }, error: (error) => {
                console.error("Could not get eligibilities: " + error.code + " " + error.message)
                // handle Error
                return []
            }
        })
    }
}

WGEligibilitiesService.$inject = ["$rootScope", "$interval"]
