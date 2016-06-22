/// <reference path="../../ts/wg.data.companies.ts" />

class CompaniesRecCtrl {

    recommended: WGCompany[]
    nonRecommended: WGCompany[]

    constructor(public $state: any, public $ionicScrollDelegate: ionic.scroll.IonicScrollDelegate, public wgCompanies: WGCompanies, public ApplicationStates: any, public $interval: any) {
        this.recommended = wgCompanies.recommended
        this.nonRecommended = wgCompanies.nonRecommended

        wgCompanies.setOnReloadCallback(() => {
            this.recommended = wgCompanies.recommended
            this.nonRecommended = wgCompanies.nonRecommended
        });
    }

    next() {
        this.ApplicationStates.next()
    }

    resize() {
        this.$ionicScrollDelegate.resize()
    }
    delayedResize() {
        // Wait for accordion animation to complete
        this.$interval(() => this.resize(), 100, 1);
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
        company: '='
    }
}