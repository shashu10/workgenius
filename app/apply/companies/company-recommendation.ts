/// <reference path="../../ts/wg.data.companies.ts" />

class CompaniesRecCtrl {

    recommended: WGCompany[]
    nonRecommended: WGCompany[]

    constructor(public $state: any, public $ionicScrollDelegate: ionic.scroll.IonicScrollDelegate, public wgCompanies: WGCompanies, public ApplicationStates: any) {
        this.recommended = wgCompanies.recommended
        this.nonRecommended = wgCompanies.nonRecommended
    }

    next() {
        this.ApplicationStates.next()
    }

    resize() {        
        this.$ionicScrollDelegate.resize()
    }
    canContinue() {
        return _.filter(this.wgCompanies.companies, (c) => c.interested).length
    }
}

CompaniesRecCtrl.$inject = ["$state", "$ionicScrollDelegate", "wgCompanies", "ApplicationStates"]