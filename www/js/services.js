angular.module('workgenius.services', [])
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
