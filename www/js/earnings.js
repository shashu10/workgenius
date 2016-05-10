angular.module('workgenius.earnings', [])
	.factory('earningsEstimate', ['$rootScope', earningsEstimate]);


function earningsEstimate($rootScope) {
	return {
		shift: function (shift) {
			var est = (shift.object &&
					   shift.object.get &&
					   shift.object.get('company') &&
					   shift.object.get('company').get &&
					   shift.object.get('company').get('earningsEst')) || 15;
			var raw = (shift.endsAt.getTime() - shift.startsAt.getTime()) / 3600000 * est;
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