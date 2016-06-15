/*
Automatic number formatting in input field

Credits:
    
    - Philip via
    https://codepen.io/rpdasilva/pen/DpbFf?editors=0010

    - Wade Tandy via
    http://stackoverflow.com/questions/19094150/using-angularjs-directive-to-format-input-field-while-leaving-scope-variable-unc
    
    - kstep via
    http://stackoverflow.com/questions/12700145/how-to-format-a-telephone-number-in-angularjs
    
    - hans via
    http://codepen.io/hans/details/uDmzf/
*/

angular.module('inputFormatter', [])

.directive('formattedInput', function($filter, $browser) {
    return {
        require: 'ngModel',
        scope: {
            formatType: '@'
        },
        link: function($scope, $element, $attrs, ngModelCtrl) {

            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '');
                $element.val($filter($scope.formatType)(value, false));
            };

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/[^0-9]/g, '').slice(0,10);
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter($scope.formatType)(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }

    };
})
.filter('tel', function () {
    return function (tel) {

        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) return tel;

        var city = value.slice(0, 3);
        var number = value.slice(3);

        if (number) {

            if (number.length > 3) number = number.slice(0, 3) + '-' + number.slice(3,7);

            return ("(" + city + ") " + number).trim();

        } else return "(" + city;

    };
})
.filter('ssn', function () {
    return function (ssn) {

        if (!ssn) { return ''; }

        var value = ssn.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) return ssn;

        var three = value.slice(0, 3);
        var six = value.slice(3);

        if (six) {

            if(six.length > 2) six = six.slice(0, 2) + '-' + six.slice(2,6);

            return (three + "-" + six).trim();

        } else return three;
    };
});