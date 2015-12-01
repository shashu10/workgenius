angular.module("templatescache", []).run(["$templateCache", function($templateCache) {$templateCache.put("templates/menu.html","<ion-side-menus enable-menu-with-back-views=\"false\">\n  <ion-side-menu-content drag-content = \"false\">\n    <ion-nav-bar class=\"bar-positive\">\n      <ion-nav-back-button>\n      </ion-nav-back-button>\n\n      <ion-nav-buttons side=\"left\">\n        <button class=\"button button-icon button-clear ion-navicon\" menu-toggle=\"left\">\n          <!-- <img src=\"img/wg-bulb-logo.png\" class=\"wg-logo\" menu-toggle=\"left\"> -->\n        </button>\n      </ion-nav-buttons>\n      <!-- <ion-nav-buttons side=\"right\">\n        <button class=\"button button-icon button-clear\" ng-show=\"showRightIcon\" ng-class=\"showCalendarIcon ? \'ion-ios-calendar-outline\' : \'ion-ios-list-outline\'\"\n        ng-click=\"showCalendarIcon ? showScheduleCalendar() : showScheduleList()\">\n        </button>\n      </ion-nav-buttons> -->\n\n    </ion-nav-bar>\n    <ion-nav-view name=\"menuContent\"></ion-nav-view>\n  </ion-side-menu-content>\n\n  <ion-side-menu side=\"left\" expose-aside-when=\"large\">\n\n    <ion-content class=\"padding-top\">\n      <div><wg-profile-photo/></div>\n      <h4 class=\"center-text\">{{currentUser.name}}</h4>\n      <ion-list>\n        <ion-item class=\"item-icon-left\" menu-close href=\"#/app/schedule-calendar-page\">\n          <i class=\"icon ion-calendar\"></i>\n          Schedule\n        </ion-item>\n        <!-- Functionality hidden -->\n        <ion-item class=\"item-icon-left\" menu-close href=\"#/app/available-shifts-page\">\n          <i class=\"icon ion-network\"></i>\n          Shift trades\n        </ion-item>\n        <ion-item class=\"item-icon-left\" menu-close href=\"#/app/earnings-page\">\n          <i class=\"icon ion-cash\"></i>\n          Earnings\n        </ion-item>\n        <ion-item class=\"item-icon-left\" menu-close href=\"#/app/preferences-page\">\n          <i class=\"icon ion-ios-gear-outline\"></i>\n          Preferences\n        </ion-item>\n\n        <p class=\"menu-note center-text\">Need some help?</p>\n\n        <ion-item class=\"item-icon-left item-positive\" ng-click=\"contactModal.show()\">\n          <i class=\"icon ion-email\"></i>\n          Contact Us\n        </ion-item>\n        \n      </ion-list>\n    </ion-content>\n  </ion-side-menu>\n</ion-side-menus>\n");
$templateCache.put("templates/availability/availability-tabs.html","<ion-view view-title=\"{{availActive ? \'Time Off\' : \'Availability\'}}\">\n	<ion-content class=\"has-tabs\">\n		<div ui-view name=\"inception\"></div>\n	</ion-content>\n	<div class=\"tabs tabs-positive tabs-icon-left\">\n        <a class=\"tab-item\" ui-sref=\"app.availability-tabs.availability\" ng-class=\"availActive ? \'\' : \'active\'\" ng-click=\"availActive = false\">\n            <i class=\"icon ion-checkmark-circled\"></i>\n			{{path}} Availability\n        </a>\n        <a class=\"tab-item\" ui-sref=\"app.availability-tabs.block-days\" ng-class=\"availActive ? \'active\' : \'\'\" ng-click=\"availActive = true\">\n            <i class=\"icon ion-close-circled\"></i>\n			Time Off\n        </a>\n    </div>\n</ion-view>\n");
$templateCache.put("templates/availability/availability.html","<grid-days></grid-days>");
$templateCache.put("templates/availability/block-days.html","<div class=\"wg-block-days\">\n	<div class=\"wg-title\">\n	    <p>\n	        Tap on the dates you can\'t work and we\'ll block them out for you. Any shifts within 72 hours of their start time have to be cancelled individually through your schedule.\n	    </p>\n	</div>\n	<flex-calendar options=\"options\" events=\"shifts\"></flex-calendar>\n</div>\n");
$templateCache.put("templates/main/available-shifts-page.html","<ion-view view-title=\"Available Shifts\">\n    <ion-content>\n    <div class=\"shifts\">\n	    <div ng-repeat=\"shift in shifts\">\n	        <shift/>\n	    </div>\n	</div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/main/companies-page.html","<ion-view view-title=\"Copmanies\">\n    <ion-content>\n        <companies/>\n    </ion-content>\n    <wg-company-footer wg-draggable-footer></wg-company-footer>\n</ion-view>\n");
$templateCache.put("templates/main/earnings-page.html","<ion-view view-title=\"Earnings\">\n    <ion-content class=\"has-header has-tabs\">\n        <div class=\"wg-title\">\n            <p>This is an estimate of your earnings based on the hours you\'ve worked</p>\n        </div>\n\n        <div class=\"center-text\">\n            <div class=\"wg-earnings-block\">\n                <h4>Today</h4>\n                <h1>\n                    {{188 | currency:undefined:0}}\n                </h1>\n                <h3>avg {{17 | currency:undefined:0}}/hr</h3>\n            </div>\n\n            <div class=\"wg-earnings-block\">\n                <h4>This Week</h4>\n                <h1>\n                    {{ 720 | currency:undefined:0}}\n                </h1>\n                <h3>avg {{19 | currency:undefined:0}}/hr</h3>\n            </div>\n\n            <div class=\"wg-earnings-block\">\n                <h4>This Month</h4>\n                <h1>\n                    {{ 2410 | currency:undefined:0}}\n                </h1>\n                <h3>avg {{18 | currency:undefined:0}}/hr</h3>\n            </div>\n\n            <div class=\"wg-earnings-block\">\n                <h4>Lifetime</h4>\n                <h1>\n                    {{ 11002 | currency:undefined:0}}\n                </h1>\n                <h3>avg {{17 | currency:undefined:0}}/hr</h3>\n            </div>\n        </div>\n    </ion-content>\n    <div class=\"tabs tabs-positive tabs-icon-left\">\n        <a class=\"tab-item active\">\n            <i class=\"icon ion-cash\"></i> Earnings\n        </a>\n        <a class=\"tab-item\" ng-click=\"toggleWithoutAnimation(\'app.hours-page\')\">\n            <i class=\"icon ion-clock\"></i> Hours\n        </a>\n    </div>\n</ion-view>\n");
$templateCache.put("templates/main/hours-page.html","<ion-view view-title=\"Hours\">\n    <ion-content class=\"has-header has-tabs\">\n\n        <!-- <div class=\"wg-title\">\n            <p>This is an estimate of your earnings based on the hours you\'ve worked</p>\n        </div> -->\n\n        <div class=\"center-text\">\n            <div class=\"wg-hours-block\">\n                <h4>Today</h4>\n                <h1>\n                    {{8}}\n                </h1>\n            </div>\n\n            <div class=\"wg-hours-block\">\n                <h4>This Week</h4>\n                <h1>\n                    {{31}}\n                </h1>\n            </div>\n\n            <div class=\"wg-hours-block\">\n                <h4>This Month</h4>\n                <h1>\n                    {{130}}\n                </h1>\n            </div>\n\n            <div class=\"wg-hours-block\">\n                <h4>Lifetime</h4>\n                <h1>\n                    {{846}}\n                </h1>\n            </div>\n        </div>\n    </ion-content>\n    <div class=\"tabs tabs-positive tabs-icon-left\">\n        <a class=\"tab-item\" ng-click=\"toggleWithoutAnimation(\'app.earnings-page\')\">\n            <i class=\"icon ion-cash\"></i> Earnings\n        </a>\n        <a class=\"tab-item active\">\n            <i class=\"icon ion-clock\"></i> Hours\n        </a>\n    </div>\n</ion-view>\n");
$templateCache.put("templates/main/preferences-page.html","<ion-view view-title=\"Preferences\">\n	<ion-content class=\"wg-preferences-page\">\n\n		<p class=\"wg-list-title\">Work Preferences</p>\n\n		<ion-list type=\"card\">\n			<ion-item href=\"#/app/target-page\">\n			   Weekly Hours Target\n				<span class=\"item-note\">\n					{{currentUser.hourlyTarget}} {{currentUser.hourlyTarget == 1 ? \'Hour\' : \'Hours\'}}\n				</span>\n			</ion-item>\n\n			<ion-item href=\"#/app/availability-tabs/availability\">\n			   Manage Availability\n				<span class=\"item-note\">\n					{{currentUser.totalHours}} {{currentUser.totalHours == 1 ? \'Hour\' : \'Hours\'}}\n				</span>\n			</ion-item>\n\n			<ion-item href=\"#/app/companies-page\">\n			   My Companies\n				<span class=\"item-note\">\n					<span ng-repeat= \"(company, value) in currentUser.companies | truncateObj : 2\">{{company}}{{$last || $middle ? \'\' : \', \'}}</span>\n				</span>\n			</ion-item>\n\n			<!-- <ion-item href=\"#/app/work-types-page\">\n			   Types of Work\n				<span class=\"item-note\">\n					<span ng-repeat= \"(workType, value) in currentUser.workTypes | truncateObj : 2\">{{workType}}{{$last || $middle ? \'\' : \', \'}}</span>\n				</span>\n			</ion-item> -->\n\n			<ion-item href=\"#/app/vehicles-page\">\n			   Vehicle Type\n				<span class=\"item-note\">\n					<span ng-repeat=\"vehicle in currentUser.vehicles | filter:{ selected: true }\" >{{vehicle.name}}{{$last ? \'\' : \', \'}}</span>\n				</span>\n			</ion-item>\n\n		</ion-list>\n\n		<p class=\"wg-list-title\">Personal Information</p>\n\n		<ion-list type=\"card\">\n			<ion-item class=\"item-input-element\">\n			   <input type=\"text\" ng-model=\"currentUser.name\" readonly=\"readonly\">\n			</ion-item>\n\n			<ion-item focus-on-tap class=\"item-input-element\">\n			   <input class=\"input-phone\" type=\'text\' phone-input ng-model=\"phoneVal\" ng-model=\"phoneVal\">\n			   <span class=\"item-note wg-floating-note\">Edit</span>\n			</ion-item>\n\n			<ion-item focus-on-tap class=\"item-input-element\">\n			   <input type=\"text\" ng-model=\"currentUser.email\">\n			   <span class=\"item-note wg-floating-note\">Edit</span>\n			</ion-item>\n\n		</ion-list>\n\n		<ion-list type=\"card\">\n			<ion-item class=\"item-icon-right assertive\" ng-click=\"logout()\">\n	          Logout\n	          <i class=\"icon ion-log-out\"></i>\n	        </ion-item>\n		</ion-list>\n\n	</ion-content>\n</ion-view>\n");
$templateCache.put("templates/main/schedule-calendar-page.html","<ion-view ng-controller=\"ScheduleCtrl\" view-title=\"{{selectedMonth | uppercase | translate}} {{selectedYear}}\">\n\n	<ion-header-bar flex-calendar-subheader class=\"bar-subheader custom-subheader\">\n		<flex-week options=\"options\" events=\"shifts\"></flex-week>\n	</ion-header-bar>\n\n    <ion-content class=\"has-flex-calendar-subheader\" >\n	        <shift-list></shift-list>\n\n		    <ion-item id=\"empty-shift-list\" class=\"item-avatar\" ng-repeat=\"empty in [1,2]\">\n		        {{$first && !groupedShifts.length ? \'No shifts to show\' : \'\'}}\n		    </ion-item>\n\n	</ion-content>\n</ion-view>");
$templateCache.put("templates/main/target-page.html","<ion-view view-title=\"Weekly Target\">\n	<ion-content>\n		<target-controls/>\n	</ion-content>\n</ion-view>\n");
$templateCache.put("templates/main/vehicles-page.html","<ion-view view-title=\"Vehicles\">\n    <ion-content>\n        <ion-list>\n            <ion-item class=\"item-checkbox item-icon-right\" ng-repeat=\"vehicle in currentUser.vehicles\">\n                <label class=\"checkbox\">\n                    <input type=\"checkbox\" ng-change=\"update()\" ng-model=\"vehicle.selected\">\n                </label>\n                {{vehicle.name}}\n                <i class=\"icon {{vehicle.icon}}\"></i>\n            </ion-item>\n        </ion-list>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/onboarding/availability-questions.html","<ion-view class=\"availability-questions\" title=\"Availability\">\n    <ion-content class=\"has-header has-subheader\">\n\n        <div>\n            <p class=\"label1\">\n                What days do you want to work?\n            </p>\n            <div class=\"row\" ng-repeat=\"i in [0, 1, 2]\">\n                <span class=\"roundLabel col-33\" ng-repeat=\"day in availQuestions.days | limitTo : 3 : i*3\">\n                    <button class=\"button button-block button-light\" ng-class=\"day.selected ? \'selected\' : \'\'\" ng-click=\"day.selected = !day.selected\">\n                        {{day.name | capitalize}}\n                    </button>\n                </span>\n            </div>\n        </div>\n\n        <div>\n            <div class=\"label2\">\n                <p class=\"center-text\">\n                    What times do you want to work?\n                </p>\n                <p class=\"center-text\">\n                    (You can customize your hourly schedule on the next page)\n                </p>\n            </div>\n            <div class=\"row\" ng-repeat=\"i in [0, 1, 2]\">\n                <span class=\"roundLabel col-33\" ng-repeat=\"timeSlot in availQuestions.timeSlots | limitTo : 3 : i*3\">\n                    <button class=\"button button-block button-light\" ng-class=\"timeSlot.selected? \'selected\' : \'\'\" ng-click=\"timeSlot.selected = !timeSlot.selected\">\n                        {{timeSlot.name | capitalize}} <br>\n                        {{timeSlot.start}} - {{timeSlot.end}}\n                    </button>\n                </span>\n            </div>\n        </div>\n        \n        <!-- Finish Onboarding -->\n        <button ng-click=\"next(); setAvailWithQuestions()\" class=\"button button-full button-positive\">\n            Continue >>\n        </button>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/onboarding/availability.html","<ion-view class=\"register\" title=\"Availability\">\n    <ion-content class=\"has-header has-subheader\">\n\n        <grid-days></grid-days>\n        \n        <!-- Finish Onboarding -->\n        <button class=\"button button-full button-positive\" ng-click=\"finish()\">\n            Finish >>\n        </button>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/onboarding/onboarding.html","<ion-nav-bar class=\"bar-positive\">\n	<ion-nav-back-button class=\"button-clear\">\n    <i class=\"icon ion-ios-arrow-back\"></i> Back\n  </ion-nav-back-button>\n	<ion-nav-buttons side=\"right\">\n        <button class=\"button button-icon button-clear\"\n        ng-click=\"skipOnboarding()\">\n        Skip\n        </button>\n      </ion-nav-buttons>\n	<ion-header-bar class=\"bar-subheader\">\n         <wg-pager/>\n	</ion-header-bar>\n\n</ion-nav-bar>\n<!-- where the initial view template will be rendered -->\n<ion-nav-view name=\"content\">\n</ion-nav-view>\n");
$templateCache.put("templates/onboarding/target-hours.html","<ion-view class=\"register\" title=\"Target Hours\">\n    <ion-content has-header=\"true\" class=\"has-subheader\">\n\n        <div class=\"padding\">\n            <target-controls/>\n        </div>\n\n        <button ng-click=\"next()\" class=\"button button-full button-positive\">\n            Continue >>\n        </button>\n\n    </ion-content>\n</ion-view>\n\n\n\n");
$templateCache.put("templates/onboarding/work-types.html","<ion-view class=\"register\" title=\"Work\">\n    <ion-content class=\"has-header has-subheader\">\n        \n        <div class=\"padding\">\n            <work-types/>\n        </div>\n        <button ng-click=\"next()\" class=\"button button-full button-positive\">\n            Continue >>\n        </button>\n    </ion-content>\n    <wg-work-types-footer wg-draggable-footer></wg-work-types-footer>\n</ion-view>\n");
$templateCache.put("templates/registration/forgot-password-page.html","<ion-view title=\"Forgot Password\">\n    <ion-content ng-show=\"!state.success\" class=\"has-header\" padding=\"true\">\n        <div class=\"list list-inset\">\n            <label class=\"item item-input\">\n                <input type=\"email\" ng-model=\"user.email\" placeholder=\"Enter your email\">\n            </label>\n        </div>\n        <div class=\"assertive\" ng-show=\"error.message\">{{error.message}}</div>\n        <button class=\"button button-block button-positive\" ng-click=\"reset()\">\n            RESET PASSWORD\n        </button>\n    </ion-content>\n    <ion-content ng-show=\"state.success\" class=\"has-header\" padding=\"true\">\n        <div class=\"positive\">An email has been sent to you with instructions on resetting your password.</div>\n        <button class=\"button button-block button-clear button-calm\" ng-click=\"login()\">\n            Log In\n        </button>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/registration/login-tab.html","<ion-view>\n    <ion-content class=\"has-header\">\n        <div class=\"list list-inset\">\n            <label class=\"item item-input\">\n                <!-- <span class=\"input-label\"> Email</span> -->\n                <i class=\"icon ion-email placeholder-icon\"></i>\n                <input placeholder=\"Email\" type=\"email\" ng-model=\"user.email\">\n            </label>\n            <label class=\"item item-input\">\n                <!-- <span class=\"input-label\"> Password</span> -->\n                <i class=\"icon ion-lock-combination placeholder-icon\"></i>\n                <input placeholder=\"Password\" type=\"password\" ng-model=\"user.password\">\n            </label>\n        </div>\n        <div class=\"assertive padding-left\" ng-show=\"error.message\">{{error.message}}</div>\n            <button class=\"button button-full button-positive\" ng-click=\"login()\">\n                LOG IN\n            </button>\n        <button class=\"button button-block button-clear button-calm\" ng-click=\"forgot()\">\n            Forgot your password?\n        </button>\n\n        <button class=\"button button-block button-clear button-calm\" ng-click=\"loginDemoUser()\">\n            Skip\n        </button>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/registration/registration.html","<div class=\"bar bar-header bar-light wg-register-bar\">\n  <div class=\"title\">\n    <span ng-class=\"signupActive ? \'selected\' : \'\'\" ui-sref=\"registration.signup\">\n      Sign up\n      <div class=\"arrow\"></div>\n    </span>\n    <span ng-class=\"signupActive ? \'\' : \'selected\'\" ui-sref=\"registration.login\">\n      Log in\n      <div class=\"arrow\"></div>\n    </span>\n  </div>\n</div>\n<!--\nCreate tabs with an icon and label, using the tabs-positive style.\nEach tab\'s child <ion-nav-view> directive will have its own\nnavigation history that also transitions its views in and out.\n-->\n<div ui-view name=\"content\" class=\"wg-register-content\"></div>");
$templateCache.put("templates/registration/signup-tab.html","<ion-view class=\"register\">\n    <!-- Set scroll to false because navigatig to the next input item causes the whole view with the nav-bars to jump -->\n    <ion-content class=\"has-header\">\n        <div class=\"list list-inset\">\n            <label class=\"item item-input\">\n                <i class=\"icon ion-person placeholder-icon\"></i>\n                <input type=\"text\" ng-model=\"user.name\" placeholder=\"Full Name\">\n            </label>\n            <label class=\"item item-input\">\n                <i class=\"icon ion-email placeholder-icon\"></i>\n                <input type=\"email\" ng-model=\"user.email\" placeholder=\"Email\">\n            </label>\n            <label class=\"item item-input\">\n                <i class=\"icon ion-lock-combination placeholder-icon\"></i>\n                <input type=\"password\" ng-model=\"user.password\" placeholder=\"Password\">\n            </label>\n            <label class=\"item item-input\">\n                <i class=\"icon ion-lock-combination placeholder-icon\"></i>\n                <input type=\"password\" ng-model=\"user.password1\" placeholder=\"Confirm Password\">\n            </label>\n        </div>\n\n        <div class=\"assertive padding\" ng-show=\"error.message\">{{error.message}}</div>\n        <button ng-click=\"register()\" class=\"button button-full button-positive\">\n            SIGN UP\n        </button>\n        <p class=\"padding\">\n            By creating an account you agree to the Terms of Use and Privacy Policy.\n        </p>\n        <button class=\"button button-block button-clear button-calm\" ng-click=\"loginDemoUser()\">\n            Skip\n        </button>\n\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/shared/accept-shift.html","<ion-modal-view>\n  <ion-header-bar>\n\n\n    <h1 class=\"title\">Shift Details</h1>\n\n\n  </ion-header-bar>\n  <ion-content class=\"padding\">\n\n  <ul >\n    <h2 class=\"center-text\">Are you sure you want to accept this shift?</h1>\n    <h4>Requested By</h4>\n    <h3>{{selectedShift.name}}</h3>\n\n    <h4>Shift Information</h4>\n    <p>\n        {{selectedShift.startsAt.getTime() | date:\'mediumDate\'}} | {{selectedShift.startsAt.getTime() | date:\'shortTime\'}} - {{selectedShift.endsAt.getTime() | date:\'shortTime\'}}\n    </p>\n\n    <p>Earnings Est: <span class=\"light-green\">{{(selectedShift.endsAt.getTime() - selectedShift.startsAt.getTime())/3600000 * hourlyRate | currency:undefined:0}}</span></p>\n\n    <h4>Company</h4>\n    <h3>{{selectedShift.company | capitalize}}</h3>\n\n    <div class=\"button-bar\">\n      <button class=\"button button-block button-positive\" ng-click=\"acceptShift(currentShift)\">Accept</button>\n      <button class=\"button button-block button-assertive\" ng-click=\"declineShift(currentShift)\">\n        Decline\n      </button>\n    </div>\n\n  </ul>\n\n  </ion-content>\n</ion-modal-view>\n");
$templateCache.put("templates/shared/cancel-shift-popup.html","<h1>Are you sure you want to cancel the following shift?</h1>\n\n<p>Late cancellations this quarter: {{cancellations}}/3</p>\n\n<img ng-src=\"img/companies/{{shift.company.toLowerCase()}}.png\" alt=\"\">\n<p class=\"schedule-time\">\n    <standard-time-meridian etime=\'shift.startsAt.getHours()*3600\'></standard-time-meridian> -\n    <standard-time-meridian etime=\'shift.endsAt.getHours()*3600\'></standard-time-meridian>\n</p>");
$templateCache.put("templates/shared/colorDivider.html","<div class=\"color-divider\">\n	<span></span>\n	<span></span>\n	<span></span>\n	<span></span>\n	<span></span>\n	<span></span>\n</div>");
$templateCache.put("templates/shared/companies.html","<div class=\"wg-grid\">\n    <div class=\"wg-title\">\n        <p>Select the companies you are eligible to work for.</p>\n    </div>\n	<div class=\"row padding-top\" ng-repeat=\"rows in chunkedCompanies\">\n	    <div class=\"col\" ng-repeat=\"key in rows\" ng-click=\"select(key)\" ng-class=\"currentUser.companies.{{key}} ? \'selected\' : \'\'\">\n	        <img ng-src=\"img/companies/{{key}}.png\" alt=\"\">\n	    </div>\n	</div>\n</div>");
$templateCache.put("templates/shared/contact-us.html","<ion-modal-view>\n    <ion-header-bar>\n        <div class=\"buttons\">\n            <button class=\"button button-positive button-clear\" ng-click=\"cancelMessage()\">\n                Cancel\n            </button>\n        </div>\n        <h1 class=\"title\">Contact Us</h1>\n        <!-- <div class=\"buttons\">\n            <button menu-toggle=\"left\" class=\"button button-positive\" ng-click=\"sendMessage()\">Send</button>\n        </div> -->\n    </ion-header-bar>\n    <ion-content class=\"contact-us-content\">\n        <p class=\"wg-title\">\n            Put anything you want to ask us in here and hit send!\n        </p>\n        <!-- <label class=\"item item-input item-stacked-label readonly\">\n	        <span class=\"input-label\">From</span>\n            <input type=\"text\" placeholder=\"First Name\" value=\"{{currentUser.name}}\" readonly=\"true\">\n        </label> -->\n        <label class=\"item item-input item-floating-label contact-message\">\n            <span class=\"input-label\">Message</span>\n            <textarea rows=\"5\" placeholder=\"Type your message here. Any questions, comments or concerns you may have.\"></textarea>\n        </label>\n        <div class=\"padding\">\n            <button class=\"button button-positive button-block\" ng-click=\"sendMessage()\">Send</button>\n        </div>\n        <div class=\"wg-title\">\n            <p>Is it an emergency?</p>\n            <a href=\"tel:+14153471890\"><button class=\"button button-clear button-assertive icon-left ion-ios-telephone\">Call Us</button></a>\n        </div>\n    </ion-content>\n</ion-modal-view>\n");
$templateCache.put("templates/shared/grid-days.html","<div class=\"days\">\n    <div class=\"wg-title\">\n        <p>Use this to customize exactly what hours you can and can\'t work. You can come back to change this later in your preferences. When you are done press the check mark on your top right.</p>\n    </div>\n    <div class=\"wg-grid-days\">\n        <div class=\"row\" ion-affix template=\"daysHeader\" data-affix-within-parent-with-class=\"wg-grid-days\">\n            <div class=\"first\"></div>\n            <div class=\"col\" ng-click=\"select(day, null)\" ng-repeat=\"day in days\">{{day | limitTo: 1}}</div>\n        </div>\n        <div class=\"row\" ng-repeat=\"(i, int) in intervals\">\n            <div class=\"first\" ng-click=\"select(null, i)\">{{int}}</div>\n            <div class=\"col\" ng-class=\"currentUser.availabilityGrid[day][i] == 1 ? \'selected\' : currentUser.availabilityGrid[day][i] == 2 ? \'maybe\' : \'\'\" ng-repeat=\"day in days\" ng-click=\"select(day, i)\">\n                <span>\n                    {{currentUser.availabilityGrid[day][i] == 1 ? \'YES\' : currentUser.availabilityGrid[day][i] == 2 ? \'MAYBE\' : \'NO\'}}\n                </span>\n            </div>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("templates/shared/shift-list.html","<div ng-repeat=\"group in groupedShifts\">\n    <div class=\"group-list\">\n        <ion-list>\n            <ion-item id=\"{{anchroID(group)}}\" class=\"item-divider\" ion-affix data-affix-within-parent-with-class=\"group-list\">\n                {{dividerFunction(group[0].startsAt)}}\n                <span>\n                    earnings est: <i class=\"light-green\">{{groupEarnings(group) | currency:undefined:0}}</i>\n                </span>\n            </ion-item>\n            <ion-item class=\"item-avatar item-company-icon\" bounce-left ng-repeat=\"shift in group\" can-swipe=\"true\">\n                <img ng-src=\"img/companies/{{shift.company.toLowerCase()}}.png\">\n                <div class=\"schedule-text\">\n                    <p>\n                        {{shift.company}}\n                    </p>\n                    <p class=\"schedule-time\">\n                        <standard-time-meridian etime=\'shift.startsAt.getHours()*3600\'></standard-time-meridian> -\n                        <standard-time-meridian etime=\'shift.endsAt.getHours()*3600\'></standard-time-meridian>\n                    </p>\n                </div>\n                <span class=\"item-note\">\n                    <strong>&lt</strong>\n                </span>\n                <ion-option-button class=\"button-info\" ng-click=\"goToApp(shift)\">\n                    App\n                </ion-option-button>\n                <!-- <ion-option-button class=\"button-positive\" ng-click=\"tradeShift(shift)\">\n                    Trade\n                </ion-option-button> -->\n                <ion-option-button class=\"button-assertive\" ng-click=\"cancelWarning(shift, group, groupedShifts)\">\n                    Cancel\n                </ion-option-button>\n            </ion-item>\n        </ion-list>\n    </div>\n</div>");
$templateCache.put("templates/shared/shift.html","<div class=\"shift\">\n    <div class=\"row shift-title\">\n        <div class=\"col\">\n            <p class=\"shift-header\">requested by</p>\n            <p class=\"shift-name\">{{shift.name}}</p>\n        </div>\n        <div>\n            <p class=\"shift-header\">shift date</p>\n            <p class=\"shift-date\">\n                {{shift.startsAt.getTime() | date:\'mediumDate\'}}\n            </p>\n            <p class=\"shift-earnings\">Earnest Est: <span class=\"light-green\">{{(shift.endsAt.getTime() - shift.startsAt.getTime())/3600000 * hourlyRate | currency:undefined:0}}</span></p>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"col box-outline img-box\">\n            <img ng-src=\"./img/companies/{{shift.company}}.png\" alt=\"\">\n            <p>{{shift.company | capitalize}}</p>\n        </div>\n        <div class=\"col box-outline time-box\">\n            <p>from</p>\n            <h4>\n                <standard-time-meridian etime=\'shift.startsAt.getHours()*3600\'></standard-time-meridian>\n            </h4>\n            <p>to</p>\n            <h4>\n            <standard-time-meridian etime=\'shift.endsAt.getHours()*3600\'></standard-time-meridian>\n            </h4>\n        </div>\n        <div class=\"col box-outline\">\n            <button ng-click=\"accept(shift)\" class=\"button button-small button-positive\">\n                Accept\n            </button>\n            <button class=\"button button-small button-stable\">\n                Decline\n            </button>\n        </div>\n    </div>\n</div>\n<color-divider/>");
$templateCache.put("templates/shared/targetControls.html","<div class=\"padding-top center-text\">\n	<p class=\"wg-title\">How many hours would you <strong>like</strong> to work per week?</p>\n	<p class= \"weekly-hours light-blue\">{{currentUser.hourlyTarget}}</p>\n	<div class=\"item range\">\n		0\n		<input type=\"range\" ng-model=\"currentUser.hourlyTarget\" name=\"hours\" ng-change=\"update(currentUser.hourlyTarget)\" min=\"0\" max=\"80\">\n		80\n	</div>\n	<p class=\"small-light\">Earnings estimate</p>\n\n	\n	<div class=\"currency-wrapper padding\">\n		<p class= \"currency-estimate light-green\">{{currentUser.hourlyTarget * hourlyRate | currency:undefined:0}} </p>\n		<span class=\"earning-label-right\">weekly</span>\n	</div>\n	<p class=\"padding-top\"></p>\n	\n	<div class=\"currency-wrapper padding\">\n		<p class= \"currency-estimate light-green\">{{currentUser.hourlyTarget * hourlyRate / 7 * 30 | currency:undefined:0}} </p>\n		<span class=\"earning-label-right\">monthly</span>\n	</div>\n</div>");
$templateCache.put("templates/shared/wg-company-footer.html","<div class=\"bar bar-footer wg-company-footer\" ng-class=\"selectedCompany.selected ? \'wg-footer-selected\' : \'\'\">\n    <img ng-src=\"img/companies/{{selectedCompany.name}}.png\" alt=\"\">\n    <p>{{selectedCompany.description}}</p>\n</div>");
$templateCache.put("templates/shared/wg-pager.html","<div class=\"wg-pager\">\n    <span ng-repeat=\"(id, item) in pages\" ng-class=\"currentPage == id ? \'selected\' : \'\'\" ng-click=\"goToPage(id)\">\n      <span class=\"wg-circle\">\n        {{id + 1}}\n      </span>\n      <span ng-hide=\"$last\" class=\"wg-dash\">\n   \n      </span>\n    </span>    \n</div>");
$templateCache.put("templates/shared/wg-profile-photo.html","<div class=\"wg-profile-wrapper\">\n	<div class=\"wg-profile-photo\"ng-click=\"changePhoto()\" ng-style=\"{\'background-image\':\'url(\'+imageURL+\')\'}\"></div>\n</div>");
$templateCache.put("templates/shared/wg-work-types-footer.html","<div class=\"bar bar-footer wg-work-types-footer\" ng-class=\"selectedWorkType.selected ? \'wg-footer-selected\' : \'\'\">\n    <i class=\"icon\" ng-class=\"selectedWorkType.icon\"></i>\n    <p>{{selectedWorkType.description}}</p>\n</div>");
$templateCache.put("templates/shared/work-types.html","<div class=\"wg-grid\">\n    <div class=\"center-text padding\">\n        <p>Select the types of work that you are interested in. bear in mind that Ridesharing and certain delivery jobs require a car!</p>\n    </div>\n    <div class=\"row padding-top\" ng-repeat=\"rows in workTypes\">\n        <div class=\"col light-blue\" ng-repeat=\"item in rows\" ng-click=\"select(item.name)\" ng-class=\"currentUser.workTypes.{{item.name}} ? \'selected\' : \'\'\">\n            <i class=\"icon\" ng-class=\"item.icon\"></i>\n            <p>{{item.name}}</p>\n        </div>\n    </div>\n</div>\n");}]);