class WGEarnings {

    constructor(public wgCompanies: WGCompaniesService) {}

    shift(shift) {
        if (!shift) return 15;
        const est = this.getCompanyEstimate(shift);
        const raw = (shift.endsAt.getTime() - shift.startsAt.getTime()) / 3600000 * est;
        return Math.round(raw);
    }
    group(group) {
        return _.reduce(group, (sum, s) => sum + this.shift(s), 0)
    }

    getCompanyEstimate(shift) {
        const found = _.find(this.wgCompanies.list, (c) => (c.name === shift.company.name))
        if (found) return found.earningsEst

        return 15;
    }
}

WGEarnings.$inject = ["wgCompanies"]
