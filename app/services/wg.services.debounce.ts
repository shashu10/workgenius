class WGDebounce {

    constructor(public $timeout: angular.ITimeoutService, public $q: angular.IQService) {}

    create(func, wait = 300, immediate = false) {
        let timeout
        let deferred = this.$q.defer()
        const that = this;
        return function() {
            const context = that
            let args = arguments
            const later = () => {
                timeout = null
                if (!immediate) {
                    deferred.resolve(func.apply(context, args))
                    deferred = that.$q.defer()
                }
            }
            const callNow = immediate && !timeout
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
