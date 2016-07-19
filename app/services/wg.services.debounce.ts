class WGDebounce {
    
    constructor(public $timeout: angular.ITimeoutService, public $q: angular.IQService) {}

    create(func, wait = 300, immediate = false) {
        var timeout
        var deferred = this.$q.defer()
        var that = this;
        return function () {
            var context = that,
                args = arguments
            var later = () => {
                timeout = null
                if (!immediate) {
                    deferred.resolve(func.apply(context, args))
                    deferred = that.$q.defer()
                }
            }
            var callNow = immediate && !timeout
            if (timeout) {
                that.$timeout.cancel(timeout)
            }
            timeout = that.$timeout(later, wait)
            if (callNow) {
                deferred.resolve(func.apply(context, args))
                deferred = that.$q.defer()
            }
            return deferred.promise
        }
    }
}
WGDebounce.$inject = ['$timeout', '$q']
