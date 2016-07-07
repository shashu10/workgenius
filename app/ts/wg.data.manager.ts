class WGDataManagerService {

    constructor(public wgCompanies: WGCompaniesService,
                public wgEligibilities: WGEligibilitiesService,
                public currentUser: CurrentUserService) {}

    init() {
        this.currentUser.init();
        this.wgCompanies.init();
    }
}

WGDataManagerService.$inject = ["wgCompanies", "wgEligibilities", "currentUser"]
