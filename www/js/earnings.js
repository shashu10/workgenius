angular.module('workgenius.earnings', [])
	.factory('earningsEstimate', ['$rootScope', earningsEstimate]);


function earningsEstimate($rootScope) {
	function avgCompanyPay (name) {
	    for (var i = 0; i < $rootScope.companyList.length; i++) {
	        if (name.toLowerCase() === $rootScope.companyList[i].name.toLowerCase())
	            return $rootScope.companyList[i].earningsEst;
	    }
	    return 15;
	}
	return {
		shift: function (shift) {
			var raw = (shift.endsAt.getTime() - shift.startsAt.getTime()) / 3600000 * avgCompanyPay(shift.company);
			return Math.round(raw);
		},
		group: function (group) {
		    var earnings = 0;
		    for (var i = 0; i < group.length; i++) {
		        var shift = group[i];
		        earnings += this.shift(shift);
		    }
		    return earnings;
		}
	};
}