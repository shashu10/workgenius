class WGDataManagerService {

    constructor(public wgCompanies: WGCompaniesService,
                public wgEligibilities: WGEligibilitiesService,
                public wgVehicles: WGVehiclesService,
                public currentUser: CurrentUserService) {}

    init() {
        this.currentUser.init();
        this.wgCompanies.init();
        this.wgVehicles.init();
    }
}

WGDataManagerService.$inject = ["wgCompanies", "wgEligibilities", "wgVehicles", "currentUser"]
