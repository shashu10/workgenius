interface CalendarEvent {
    date: Date
}
class ScheduleCtrl {

    options: any
    shiftToCancel: WGShift
    selectedMonth = moment().format('MMMM')
    selectedYear = moment().format('YYYY')

    constructor(public $rootScope:           angular.IRootScopeService,
                public $ionicScrollDelegate: ionic.scroll.IonicScrollDelegate,
                public $location:            angular.ILocationService,
                public $ionicPopup:          ionic.popup.IonicPopupService,
                public $timeout:             angular.ITimeoutService,
                public wgShifts:             WGShiftsService,
                public wgEarnings:           WGEarnings,
                public currentUser:          CurrentUserService,
                public connectedShifts) {

        this.options = {

            minDate: moment('2015-12-01').format('YYYY-MM-DD'),
            maxDate: moment().add(3, 'months').format('YYYY-MM-DD'),

            eventClick: (event: CalendarEvent) => {

                var m = moment(event.date)
                this.scrollTo(event)
                this.selectedMonth = m.format('MMMM')
            },
            dateClick: (event: CalendarEvent) => {

                var m = moment(event.date)
                this.scrollTo(event)
                this.selectedMonth = m.format('MMMM')
            },
            changeMonth: (month, year) => {

                this.selectedMonth = month.name
                this.selectedYear = year

                if (moment(month + '+').format('M') === month.index)
                    this.scrollTo({date: new Date()})
                else
                    this.scrollTo({date: new Date(year + "/" + month.index + "/" + 1)})
            },
        }
    }
    doRefresh(): void {
        this.wgShifts.getAllScheduled()
        .then(() => this.$rootScope.$broadcast('scroll.refreshComplete'))
    }
    cancelWarning(shift: WGShift): void {
        var scope = this.$rootScope.$new(true)

        scope['shift']           = shift
        scope['dividerFunction'] = this.dividerFunction
        scope['formatAMPM']      = this.formatAMPM
        scope['wgEarnings']      = this.wgEarnings
        scope['isWithin72Hr']    = this.isWithin72Hr

        this.$ionicPopup.show({
            templateUrl: 'popups/cancel_shift_popup.html',
            title: 'Are you sure you want<br>to cancel this shift?',
            scope: scope,
            buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                text: 'No, Leave it',
                type: 'button-dark',
                onTap: (e) => false
            }, {
                text: 'Yes, Cancel',
                type: 'button-assertive',
                onTap: (e) => true
            }]
        })

        .then((cancel) => {
            if (cancel) this.wgShifts.cancel(shift)
        })
    }

    gotoAnchor(anchorID: string): void {
        this.$location.hash(anchorID)
        // Does not work immediately
        this.$timeout(() => {this.$ionicScrollDelegate.anchorScroll(true)}, 10)
    }
    scrollTo(event: CalendarEvent): void {
        var eventDate = moment(event.date)

        var found = _.find(this.wgShifts.list, (s) => (eventDate.isSameOrBefore(s.date)))
        if (found) this.gotoAnchor("id" + moment(found.date).format('YYYY-MM-DD'));
        // this.gotoAnchor('empty-shift-list')
        this.$ionicScrollDelegate.scrollBottom()
    }
    cancelShift(shift: WGShift): void {
        mixpanel.track("Pressed Cancel - " + shift.company.name)
        this.shiftToCancel = shift

        this.cancelWarning(shift)
    }

    anchorID        (group: WGShift[]): string  {return "id" + moment(group[0].startsAt).format('YYYY-MM-DD')}
    formatAMPM      (date: Date)      : string  {return moment(date).format('h:mm a')}
    dividerFunction (date: Date)      : string  {return moment(date).format('dddd, MMM Do')}
    isWithin72Hr    (date: Date)      : boolean {return moment(date).isBefore(moment().add(72, 'hour'))}
}

angular.module('wg.schedule', [])

// ============ //
//   SCHEDULE   //
// ============ //

.directive('bounceLeft', ['$interval', function($interval) {
        var isOpen = function(element) {
            var children = element.children()
            if (children && children[0] && children[0].style.transform) {
                if (children[0].style.transform.indexOf('translate3d') > -1) {
                    return children[0].style
                }
            }
            return false
        }
        var close = function(style) {
            style.transform = ''
        }
        return function(scope, element, attr) {
            var bounce
            // stops bounce when dragging left
            element.on('drag', function(event) {
                element.removeClass('bounce-left')
                $interval.cancel(bounce)
                bounce = undefined
            })
            element.on('click', function(event) {
                var open = isOpen(element)
                if (open) {
                    close(open)
                    return
                }

                // Prevent default dragging of selected content
                if (element.hasClass('bounce-left')) return
                event.preventDefault()
                element.addClass('bounce-left')
                bounce = $interval(function() {
                    element.removeClass('bounce-left')
                }, 1000, 1)

            });
        };
    }])
    .directive('ionCalSubheader', function() {
        return {
            link: function(scope, element, attrs) {
                scope.$watch(function() {

                    var height = element[0].offsetHeight + element[0].offsetTop

                    // Get the ion-content element containing has-subheader
                    var content = angular.element(document.querySelector('.has-ion-cal-subheader'))

                    content.css("top", height + "px")
                })
            }
        }
    })
    .controller('ScheduleCtrl', [
        '$rootScope',
        '$ionicScrollDelegate',
        '$location',
        '$ionicPopup',
        '$timeout',
        'wgShifts',
        'wgEarnings',
        'currentUser',
        'connectedShifts',
        ScheduleCtrl
    ])
