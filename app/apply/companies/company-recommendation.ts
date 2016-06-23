/// <reference path="../../ts/wg.data.companies.ts" />

class CompaniesRecCtrl {

    recommended: WGCompany[]
    nonRecommended: WGCompany[]

    constructor(public $state: ng.ui.IStateService, public $ionicScrollDelegate: ionic.scroll.IonicScrollDelegate, public wgCompanies: WGCompanies, public ApplicationStates: ApplicationStatesService, public $interval: ng.IIntervalService, public connectPopup: ConnectPopup) {

        this.recommended = wgCompanies.recommended
        this.nonRecommended = wgCompanies.nonRecommended

        // Reload view after wgCompanies model updates
        wgCompanies.setOnReloadCallback(() => {
            this.recommended = wgCompanies.recommended
            this.nonRecommended = wgCompanies.nonRecommended
        });
    }

    next() {
        this.ApplicationStates.next()
    }

    toggleDetail(company: WGCompany) {
        // Toggle whether to show this company's detail view
        company.showDetail = !company.showDetail

        // hide other companies detail view
        _.forEach(this.wgCompanies.companies, (c) => {
            if (!_.isEqual(company, c))
                c.showDetail = false;
        })

        // Resize after accordion animation
        this.$interval(() => this.resize(), 100, 1);
    }

    resize() {
        this.$ionicScrollDelegate.resize()
    }

    canContinue() {
        return _.filter(this.wgCompanies.companies, (c) => c.interested).length
    }
}

CompaniesRecCtrl.$inject = ["$state", "$ionicScrollDelegate", "wgCompanies", "ApplicationStates", "$interval"]


class CompanyDetail implements ng.IDirective {

    static instance(): ng.IDirective {
        return new CompanyDetail;
    }

    templateUrl = 'apply/companies/company-detail.html';
    restrict = 'E'
    scope = {
        companiesCtrl: '=',
        company: '='
    }
}