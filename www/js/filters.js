angular.module('workgenius.filters', [])
.filter('spaceless',function() {
    return function(input) {
        if (input) {
            return input.replace(/\s+/g, '_');    
        }
    };
})
// capitalize: true, capitalizes all words. False/undefined capitalizes only first word
.filter('capitalize', function() {
    return function(input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
        return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
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