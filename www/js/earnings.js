angular.module('workgenius.earnings', [])
	.factory('earningsEstimate', ['$rootScope', earningsEstimate]);


function earningsEstimate($rootScope) {
	function getCompanyEstimate(shift) {

		if (shift.company) {
			for (var i = 0; i < $rootScope.companyList.length; i++) {
	            var comp = $rootScope.companyList[i];
	            if (comp.name === shift.company) {
	                return comp.earningsEst;
	            }
	        }
		}
		return 15;
	}
	return {
		shift: function (shift) {
			if (!shift) return 15;
			var est = getCompanyEstimate(shift);
			var raw = (shift.endsAt.getTime() - shift.startsAt.getTime()) / 3600000 * est;
			return Math.round(raw);
		},
		group: function (group) {
			if (!group) return;

		    var earnings = 0;
		    for (var i = 0; i < group.length; i++) {
		        var shift = group[i];
		        earnings += this.shift(shift);
		    }
		    return earnings;
		}
	};
}