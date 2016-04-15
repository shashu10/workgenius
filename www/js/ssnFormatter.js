// http://codepen.io/stoplion/pen/eBoxz
(function () {
    angular.module('SSN-formatter', [])
    .filter('ssnFilter', function () {
        return function (value, mask) {
            var len, val;
            if (!mask) {
                mask = false;
            }
            if (value) {
                val = value.toString().replace(/\D/g, '');
                len = val.length;
                if (len < 4) {
                    return val;
                } else if (3 < len && len < 6) {
                    if (mask) {
                        return '***-' + val.substr(3);
                    } else {
                        return val.substr(0, 3) + '-' + val.substr(3);
                    }
                } else if (len > 5) {
                    if (mask) {
                        return '***-**-' + val.substr(5, 4);
                    } else {
                        return val.substr(0, 3) + '-' + val.substr(3, 2) + '-' + val.substr(5, 4);
                    }
                }
            }
            return value;
        };
    }).filter('ssnReverse', function () {
        return function (value) {
            if (!!value) {
                return value.replace(/\D/g, '').substr(0, 9);
            }
            return value;
        };
    }).directive('ssnField', function ($filter) {
        var ssnFilter, ssnReverse;
        ssnFilter = $filter('ssnFilter');
        ssnReverse = $filter('ssnReverse');
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                var formatter, mask, parser;
                mask = attrs.ssnFieldMask;
                formatter = function (value) {
                    return ssnFilter(value);
                };
                parser = function (value) {
                    var formatted;
                    formatted = ssnReverse(value);
                    element.val(ssnFilter(formatted));
                    return formatted;
                };
                modelCtrl.$formatters.push(formatter);
                return modelCtrl.$parsers.unshift(parser);
            }
        };
    });
}());