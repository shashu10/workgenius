class WGDebounce {
    
    constructor(public $timeout: angular.ITimeoutService, public $q: angular.IQService) {}

    create(func, wait = 500, immediate = false) {
        var timeout
        var deferred = this.$q.defer()
        return () => {
            var context = this,
                // args = arguments
            var later = () => {
                timeout = null
                if (!immediate) {
                    deferred.resolve(func.apply(context))
                    deferred = this.$q.defer()
                }
            }
            var callNow = immediate && !timeout
            if (timeout) {
                this.$timeout.cancel(timeout)
            }
            timeout = this.$timeout(later, wait)
            if (callNow) {
                deferred.resolve(func.apply(context))
                deferred = this.$q.defer()
            }
            return deferred.promise
        }
    }
}
WGDebounce.$inject = ['$timeout', '$q']
