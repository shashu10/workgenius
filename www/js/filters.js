angular.module('workgenius.filters', [])
.filter('capitalize', function() {
  return function(input, scope) {
    if (input) input = input.toLowerCase();
    return input && (input.substring(0,1).toUpperCase()+input.substring(1));
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