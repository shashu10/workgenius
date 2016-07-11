/// <reference path="../../ts/wg.data.companies.ts" />

class CompaniesRecCtrl {

    public companies: WGCompany[]
    public recommended: WGCompany[]
    public nonRecommended: WGCompany[]

    constructor(public $ionicScrollDelegate: ionic.scroll.IonicScrollDelegate,
                public currentUser: CurrentUserService,
                public wgCompanies: WGCompaniesService,
                public ApplicationStates: ApplicationStatesService,
                public $interval: ng.IIntervalService,
                public connectPopup: ConnectPopupService) {

        this.loadCompanies()
        wgCompanies.onDataReload = () => {
            this.loadCompanies()
        }
    }

    loadCompanies() {
        this.recommended = []
        this.nonRecommended = []

        _.forEach(this.wgCompanies.list, (c) => {
            if (!c.order) return

            if (this.matchesLocation(c) && this.matchesVehicles(c))
                this.recommended.push(c)
            else
                this.nonRecommended.push(c)
        })
    }
    matchesLocation(company: WGCompany) {
        var userLocs = _.map(this.currentUser.locations, (l) => l.name.toLowerCase())
        // If user has selected any vehicle required by company
        if (_.intersection(company.availableLocations, userLocs).length > 0) return true
    }
    matchesVehicles(company: WGCompany) {
        var userVehicles = _.map(this.currentUser.selectedVehicles, (v) => v.toLowerCase())
        // If company doesn't require a vehicle, user is eligible to work for it
        if (_.find(company.requiredVehicles, (v) => v.toLowerCase() === "none")) return true
        // If user has selected any vehicle required by company
        if (_.intersection(company.requiredVehicles, userVehicles).length > 0) return true
    }
    connect(company) {
        this.connectPopup.show(company)
    }

    next() {
        this.wgCompanies.saveAll()
        // start the application flow
        this.ApplicationStates.start()
    }

    toggleDetail(company: WGCompany) {
        // Toggle whether to show this company's detail view
        company.showDetail = !company.showDetail

        // hide other companies detail view
        _.forEach(this.wgCompanies.list, (c) => {
            if (!_.isEqual(company, c) || !company.interested)
                c.showDetail = false
        })

        // Resize after accordion animation
        this.$interval(() => this.resize(), 100, 1)
    }

    resize() {
        this.$ionicScrollDelegate.resize()
    }

    canContinue() {
        return _.filter(this.wgCompanies.list, (c) => c.interested).length
    }
}

CompaniesRecCtrl.$inject = ["$ionicScrollDelegate", "currentUser", "wgCompanies", "ApplicationStates", "$interval", "connectPopup"]


class CompanyDetail implements ng.IDirective {

    static instance(): ng.IDirective {
        return new CompanyDetail()
    }

    templateUrl = 'apply/companies/company-detail.html'
    restrict = 'E'
    scope = {
        companiesCtrl: '=',
        company: '='
    }
}
