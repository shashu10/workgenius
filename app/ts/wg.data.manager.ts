class WGDataManagerService {

    constructor(public wgCompanies: WGCompaniesService,
                public wgEligibilities: WGEligibilitiesService,
                public currentUser: CurrentUserService) {}

    init() {
        this.currentUser.init();
    }
}

WGDataManagerService.$inject = ["wgCompanies", "wgEligibilities", "currentUser"]
