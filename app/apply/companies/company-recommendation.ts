/// <reference path="../../ts/wg.data.companies.ts" />

class CompaniesRecCtrl {

    recommended: WGCompany[]
    nonRecommended: WGCompany[]

    constructor(public $state: any, public wgCompanies: WGCompanies, public ApplicationStates: any) {
        this.recommended = wgCompanies.recommended
        this.nonRecommended = wgCompanies.nonRecommended
    }

    next() {
        this.ApplicationStates.next()
    }

    canContinue() {
        return _.filter(this.wgCompanies.companies, (c) => c.interested).length
    }
}

CompaniesRecCtrl.$inject = ["$state", "wgCompanies", "ApplicationStates"]