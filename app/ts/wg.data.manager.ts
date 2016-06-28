class WGDataManagerService {

    constructor(public wgCompanies: WGCompaniesService, public wgEligibilities: WGEligibilitiesService, public wgVehicles: WGVehiclesService) {}

    init() {
        this.wgCompanies.init();
        this.wgVehicles.init();
    }
}

WGDataManagerService.$inject = ["wgCompanies", "wgEligibilities", "wgVehicles"]
