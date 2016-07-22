let _WGEligibilityTokenRefresher

enum EligibilityStage {
    interested = <any> "interested",
    applied    = <any> "applied"   ,
    approved   = <any> "approved"  ,
    connected  = <any> "connected" ,
}

// Makes it easy to keep track of eligibilities
class WGEligibility extends Parse.Object {

    constructor(company: WGCompany, interested = false) {
        super('Eligibility')

        this.worker = Parse.User.current()
        this.company = company
        this.interested = interested
    }

    get interested(): boolean { return this.get('interested') }
    set interested(interested: boolean) { this.set('interested', interested) }

    // get worker(): Parse.User { return this.get('worker') }
    set worker(worker: Parse.User) { this.set('worker', worker) }

    get company(): WGCompany { return this.get('company') }
    set company(company: WGCompany) { this.set('company', company) }

    get stage(): EligibilityStage { return this.get('stage') }
    set stage(stage: EligibilityStage) { this.set('stage', stage) }

    get applied()   : boolean { return this.get('applied') }
    get connected() : boolean { return this.get('connected') }
    get password()  : {}      { return this.get('password') }
    get username()  : string  { return this.get('username') }
    get token()     : string  { return this.get('token') }
    get workerId()  : string  { return this.get('workerId') }
    get vehicle_id(): number  { return this.get('vehicle_id') }

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

class WGEligibilitiesService implements IObservable {

    public list: WGEligibility[] = []

    // OnLoad listeners
    private _onLoadListeners: Function[];
    // Once registered, the OnLoadListener will be notified of any changes in state.
    public RegisterOnLoadListener(listener: Function) {this._onLoadListeners.push(listener)}
    // Give the OnLoadListener a way to de-register
    public RemoveOnLoadListener(listener: Function) {_.remove(this._onLoadListeners, (l) => l === listener)}
    // Notify all the OnLoadListeners
    public NotifyOnLoadListeners() {_.forEach(this._onLoadListeners, (l) => l(this.list))}

    constructor(public $rootScope: ng.IRootScopeService,
                public $interval: angular.IIntervalService) {

        this._onLoadListeners = [];
        Parse.Object.registerSubclass('Eligibility', WGEligibility)
    }

    getCompanyEligibility(companyName: string): WGEligibility {
        return _.find(this.list, (el) => el.company.name.toLowerCase() === companyName.toLowerCase())
    }

    load(): Parse.IPromise<any[]> {
        if (!Parse.User.current()) {
            this.list = []
            return Parse.Promise.as([])
        }

        return this.fetchAll()

        .then((results) => {
            this.startRefreshTimers()
            this.list = results
            this.NotifyOnLoadListeners()
            return this.list

        }, (err) => {
            console.log("Could not get eligibilities")
            return undefined
        })
    }
    connect(company: WGCompany, user: ConnectUser): Parse.IPromise<any> {
        return this.getOrCreateEligibility(company)
        .then((el) => {
            return Parse.Cloud.run('authConnectedAccount',
            {
                eligibilityId : el.id,
                companyId : company.id,
                company : company.name,
                username : user.username,
                password : user.password,
            })
        })
        .then((result) => {
            console.log(result)
            this.load()

        }, (error) => {
            console.log('Could not connect account')
            console.log(error)
            return Parse.Promise.error(error)
        })
    }
    private getOrCreateEligibility(company: WGCompany): Parse.Promise<any> {
        const el = this.getCompanyEligibility(company.name)
        if (el) return Parse.Promise.as(el)
        else return this.createEligibility(company)
    }
    private createEligibility(company: WGCompany): Parse.Promise<any> {
        const el = new WGEligibility(company, true)
        this.list.push(el)
        return el.save()
    }
    // Check if tokens need to be refreshed every hour
    private startRefreshTimers() {
        if (_WGEligibilityTokenRefresher) this.$interval.cancel(_WGEligibilityTokenRefresher)
        _WGEligibilityTokenRefresher = this.$interval(() => this.refreshAllTokens(), 1 * 60 * 60 * 1000)
    }
    private refreshAllTokens() {
        _.forEach(this.list, (el) => {

            if (!el.username || !el.password) return

            let duration: number
            if (el.company.name === 'doordash')       duration = 3 * 60 * 60 * 1000
            else if (el.company.name === 'postmates') duration = 12 * 60 * 60 * 1000
            else return

            // If not expired, wait until next refresh
            const expiration = moment(el.tokenRefreshedAt).add(duration, 'milliseconds')
            if (expiration.isAfter(moment())) return

            // Otherwise refresh token
            el.refreshToken()
        })
    }
    private fetchAll(): Parse.Promise<any[]> {

        const query = new Parse.Query(WGEligibility)
        query.equalTo('worker', Parse.User.current())
        query.include('company')

        return query.find()
    }
}

WGEligibilitiesService.$inject = ["$rootScope", "$interval"]
