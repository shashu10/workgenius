class WGEarnigns {

    constructor(public wgCompanies: WGCompaniesService) {}

    shift(shift) {
        if (!shift) return 15;
        var est = this.getCompanyEstimate(shift);
        var raw = (shift.endsAt.getTime() - shift.startsAt.getTime()) / 3600000 * est;
        return Math.round(raw);
    }
    group(group) {
        return _.reduce(group, (sum, s) => sum + this.shift(s), 0)
    }

    getCompanyEstimate(shift) {
        var found = _.find(this.wgCompanies.list, (c) => (c.name === shift.company))
        if (found) return found.earningsEst

        return 15;
    }
}

WGEarnigns.$inject = ["wgCompanies"]
