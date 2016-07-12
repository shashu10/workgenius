var _WGEligibilityTokenRefresher

// Makes it easy to keep track of eligibilities
class WGEligibility extends Parse.Object {

    constructor(company: WGCompany, interested = false) {
        super('Eligibility')

        this.worker = Parse.User.current()
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

    get username()  : string { return this.get('username') }
    get token()     : string { return this.get('token') }
    get workerId()  : string { return this.get('workerId') }
    get vehicle_id(): number { return this.get('vehicle_id')}

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

    load(): Parse.IPromise<any[]> {
        return this.fetchAll()
        .then((results) => {
            this.startRefreshTimers()
            return this.list = results
        }, (err) => {
            console.log("Could not get eligibilities")
            return undefined
        })
    }

    // Check if tokens need to be refreshed every hour
    private startRefreshTimers() {
        if (_WGEligibilityTokenRefresher) this.$interval.cancel(_WGEligibilityTokenRefresher)
        _WGEligibilityTokenRefresher = this.$interval(() => this.refreshAllTokens(), 1 * 60 * 60 * 1000)
    }
    private refreshAllTokens() {
        _.forEach(this.list, (el) => {
            var duration: number
            if (el.company.name === 'doordash')       duration = 3 * 60 * 60 * 1000
            else if (el.company.name === 'postmates') duration = 12 * 60 * 60 * 1000
            else return

            // If not expired, wait until next refresh
            var expiration = moment(el.tokenRefreshedAt).add(duration, 'milliseconds');
            if (expiration.isAfter(moment())) return

            // Otherwise refresh token
            el.refreshToken()
        })
    }
    private fetchAll(): Parse.Promise<any[]> {

        var query = new Parse.Query(WGEligibility)
        query.equalTo('worker', Parse.User.current())
        query.include('company')

        return query.find()
    }
}

WGEligibilitiesService.$inject = ["$rootScope", "$interval"]
