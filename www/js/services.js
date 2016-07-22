angular.module('workgenius.services', ['base64'])
    .service('PtrService', ['$timeout', '$ionicScrollDelegate', function($timeout, $ionicScrollDelegate) {

        /**
         * Trigger the pull-to-refresh on a specific scroll view delegate handle.
         * https://calendee.com/2015/04/25/trigger-pull-to-refresh-in-ionic-framework-apps/
         * @param {string} delegateHandle - The `delegate-handle` assigned to the `ion-content` in the view.
         */
        this.triggerPtr = function(delegateHandle) {

            $timeout(function() {

                var scrollView = $ionicScrollDelegate.$getByHandle(delegateHandle).getScrollView();

                if (!scrollView) return;

                scrollView.__publish(
                    scrollView.__scrollLeft, -scrollView.__refreshHeight,
                    scrollView.__zoomLevel, true);

                var d = new Date();

                scrollView.refreshStartTime = d.getTime();

                scrollView.__refreshActive = true;
                scrollView.__refreshHidden = false;
                if (scrollView.__refreshShow) {
                    scrollView.__refreshShow();
                }
                if (scrollView.__refreshActivate) {
                    scrollView.__refreshActivate();
                }
                if (scrollView.__refreshStart) {
                    scrollView.__refreshStart();
                }

            });

        };
    }])
    .factory('utils', ['$ionicPosition', function($ionicPosition) {

        // private API
        var applyTransform = function(element, transformString) {
            // do not apply the transformation if it is already applied
            if (element.style[ionic.CSS.TRANSFORM] == transformString) {} else {
                element.style[ionic.CSS.TRANSFORM] = transformString;
            }
        };

        // see https://api.jquery.com/closest/ and http://ionicframework.com/docs/api/utility/ionic.DomUtil/
        var getParentWithClass = function(elementSelector, parentClass) {
            return angular.element(ionic.DomUtil.getParentWithClass(elementSelector[0], parentClass));
        };

        // see http://underscorejs.org/#throttle
        var throttle = function(theFunction) {
            return ionic.Utils.throttle(theFunction);
        };

        // see https://api.jquery.com/offset/
        // see http://ionicframework.com/docs/api/service/$ionicPosition/
        var offset = function(elementSelector) {
            return $ionicPosition.offset(elementSelector);
        };

        // see https://api.jquery.com/position/
        // see http://ionicframework.com/docs/api/service/$ionicPosition/
        var position = function(elementSelector) {
            return $ionicPosition.position(elementSelector);
        };

        var translateUp = function(element, dy, executeImmediately) {
            var translateDyPixelsUp = dy === 0 ? 'translate3d(0px, 0px, 0px)' : 'translate3d(0px, -' + dy + 'px, 0px)';
            // if immediate execution is requested, then just execute immediately
            // if not, execute in the animation frame.
            if (executeImmediately) {
                applyTransform(element, translateDyPixelsUp);
            } else {
                // see http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
                // see http://ionicframework.com/docs/api/utility/ionic.DomUtil/
                ionic.requestAnimationFrame(function() {
                    applyTransform(element, translateDyPixelsUp);
                });
            }
        };
        return {
            getParentWithClass: getParentWithClass,
            throttle: throttle,
            offset: offset,
            position: position,
            translateUp: translateUp,
        };
    }]);
