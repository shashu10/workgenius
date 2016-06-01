angular.module('workgenius.filters', [])
.filter('spaceless',function() {
    return function(input) {
        if (input) {
            return input.replace(/\s+/g, '_');    
        }
    };
})
// returns hours between two times
.filter('hoursBetween', function() {
    return function(start, end) {
        return moment(end).diff(start, 'minutes')/60;
    };
})
// capitalize: true, capitalizes all words. False/undefined capitalizes only first word
.filter('capitalize', function() {
    return function(input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
        return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);}) : '';
    };
})
.filter('availableShiftFilter', function() {
    return function(items, selectedDay) {
        var result = [];
        if (!items) return result;
        for (var i=0; i<items.length; i++){
            if (moment(items[i].startsAt).isSame(selectedDay, 'day')) {
                result.push(items[i]);
            }
        }            
        return result;
    };
})
.filter('joinBy', function () {
    return function (input,delimiter) {
        return (input || []).join(delimiter || ',');
    };
})
.filter('isEmpty', function () {
    var bar;
    return function (obj) {
        for (bar in obj) {
            if (obj.hasOwnProperty(bar)) {
                return false;
            }
        }
        return true;
    };
})
.filter('truncateObj', [function(){
    return function(obj, limit){
        if (!obj) {
            return [];
        }
        
        var keys = Object.keys(obj);
        if(keys.length < 1){
            return [];
        }

        var ret = {},
        count = 0,
        additional = 0;

        angular.forEach(keys, function(key, arrayIndex){
            if(count >= limit){
            	additional ++;
                return true;
            }
            ret[key] = obj[key];
            count++;
        });
        
        if (additional) {
	        var additionalKey = " +" + additional;
	        ret[additionalKey] = true;
        }
        return ret;
    };
}]);