/// <reference path="../../ts/wg.data.companies.ts" />

class CompaniesRecCtrl {

    recommended: WGCompany[]
    nonRecommended: WGCompany[]

    constructor(public $ionicScrollDelegate: ionic.scroll.IonicScrollDelegate,
                public wgCompanies: WGCompaniesService,
                public ApplicationStates: ApplicationStatesService,
                public $interval: ng.IIntervalService,
                public connectPopup: ConnectPopupService) {

        this.recommended = wgCompanies.recommended
        this.nonRecommended = wgCompanies.nonRecommended

        // Reload view after wgCompanies model updates
        wgCompanies.onDataReload = () => {
            this.recommended = wgCompanies.recommended
            this.nonRecommended = wgCompanies.nonRecommended
        }
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

CompaniesRecCtrl.$inject = ["$ionicScrollDelegate", "wgCompanies", "ApplicationStates", "$interval", "connectPopup"]


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