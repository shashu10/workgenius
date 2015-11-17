angular.module("templatescache", []).run(["$templateCache", function($templateCache) {$templateCache.put("templates/menu.html","<ion-side-menus enable-menu-with-back-views=\"false\">\n  <ion-side-menu-content>\n    <ion-nav-bar class=\"bar-positive\">\n      <ion-nav-back-button>\n      </ion-nav-back-button>\n\n      <ion-nav-buttons side=\"left\">\n        <!-- <button class=\"button button-icon button-clear ion-lightbulb\" menu-toggle=\"left\"> -->\n          <img src=\"img/wg-bulb-logo.png\" class=\"wg-logo\" menu-toggle=\"left\">\n        </button>\n      </ion-nav-buttons>\n      <ion-nav-buttons side=\"right\">\n        <button class=\"button button-icon button-clear\" ng-show=\"showRightIcon\" ng-class=\"showCalendarIcon ? \'ion-ios-calendar-outline\' : \'ion-ios-list-outline\'\"\n        ng-click=\"showCalendarIcon ? showScheduleCalendar() : showScheduleList()\">\n        </button>\n      </ion-nav-buttons>\n\n    </ion-nav-bar>\n    <ion-nav-view name=\"menuContent\"></ion-nav-view>\n  </ion-side-menu-content>\n\n  <ion-side-menu side=\"left\" expose-aside-when=\"large\">\n\n    <ion-content class=\"padding-top\">\n      <div><wg-profile-photo/></div>\n      <h4 class=\"wg-user-name\">{{currentUser.name}}</h4>\n      <ion-list>\n        <ion-item class=\"item-icon-left\" menu-close href=\"#/app/schedule-calendar-page\">\n          <i class=\"icon ion-calendar\"></i>\n          Schedule\n        </ion-item>\n        <!-- Functionality hidden -->\n        <!-- <ion-item class=\"item-icon-left\" menu-close href=\"#/app/available-shifts-page\">\n          <i class=\"icon ion-network\"></i>\n          Shift trades\n        </ion-item> -->\n        <ion-item class=\"item-icon-left\" menu-close href=\"#/app/earnings-page\">\n          <i class=\"icon ion-cash\"></i>\n          Earnings\n        </ion-item>\n        <ion-item class=\"item-icon-left\" menu-close href=\"#/app/preferences-page\">\n          <i class=\"icon ion-ios-gear-outline\"></i>\n          Preferences\n        </ion-item>\n\n        <p class=\"menu-note\">Need some help?</p>\n\n        <ion-item class=\"item-icon-left item-positive\" ng-click=\"contactModal.show()\">\n          <i class=\"icon ion-email\"></i>\n          Contact Us\n        </ion-item>\n        \n      </ion-list>\n    </ion-content>\n  </ion-side-menu>\n</ion-side-menus>\n");
$templateCache.put("templates/login/login-tab.html","<ion-view view-title=\"Login\">\n    <ion-content class=\"has-header has-pager\" has-tabs=\"true\" ng-class=\"{\'slide-down hidden\' : currentPage > -1}\">\n        <div class=\"list\">\n            <label class=\"item item-input\">\n                <!-- <span class=\"input-label\"> Email</span> -->\n                <i class=\"icon ion-email placeholder-icon\"></i>\n                <input placeholder=\"Email\" type=\"email\" ng-model=\"user.email\">\n            </label>\n            <label class=\"item item-input\">\n                <!-- <span class=\"input-label\"> Password</span> -->\n                <i class=\"icon ion-lock-combination placeholder-icon\"></i>\n                <input placeholder=\"Password\" type=\"password\" ng-model=\"user.password\">\n            </label>\n        </div>\n        <div class=\"assertive padding-left\" ng-show=\"error.message\">{{error.message}}</div>\n        <div class=\"padding\">\n            <button class=\"button button-block button-positive\" ng-click=\"login()\">\n                LOG IN\n            </button>\n        </div>\n        <button class=\"button button-block button-clear button-calm\" ng-click=\"forgot()\">\n            Forgot your password?\n        </button>\n\n        <button class=\"button button-block button-clear button-calm\" ng-click=\"loginDemoUser()\">\n            Skip\n        </button>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/login/register-account-info.html","<ion-view class=\"register\" title=\"Register\">\n    <!-- Set scroll to false because navigatig to the next input item causes the whole view with the nav-bars to jump -->\n    <ion-content has-header=\"true\" class=\"has-subheader has-pager\" ng-class=\"{\'slide-up hidden\' : currentPage === -1}\">\n        <div class=\"list\">\n            <label class=\"item item-input\">\n                <i class=\"icon ion-person placeholder-icon\"></i>\n                <input type=\"text\" ng-model=\"user.name\" placeholder=\"Name\">\n            </label>\n            <label class=\"item item-input\">\n                <i class=\"icon ion-email placeholder-icon\"></i>\n                <input type=\"email\" ng-model=\"user.email\" placeholder=\"Email\">\n            </label>\n            <label class=\"item item-input\">\n                <i class=\"icon ion-lock-combination placeholder-icon\"></i>\n                <input type=\"password\" ng-model=\"user.password\" placeholder=\"Password\">\n            </label>\n            <label class=\"item item-input\">\n                <i class=\"icon ion-lock-combination placeholder-icon\"></i>\n                <input type=\"password\" ng-model=\"user.password1\" placeholder=\"Confirm Password\">\n            </label>\n            <div class=\"padding\">\n                <button ng-click=\"next()\" class=\"button button-block button-positive\">\n                    Continue >>\n                </button>\n            </div>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/login/register-availability.html","<ion-view class=\"register\" title=\"Availability\">\n    <ion-content has-header=\"true\" class=\"has-subheader\">\n\n        <grid-days></grid-days>\n        \n        <!-- Signup -->\n        <div class=\"padding\">\n            <div class=\"assertive\" ng-show=\"error.message\">{{error.message}}</div>\n            <button class=\"button button-block button-positive\" ng-click=\"register()\">\n                Finish >>\n            </button>\n            By creating an account you agree to the Terms of Use and Privacy Policy.\n            <button class=\"button button-block button-clear button-calm\" ng-click=\"loginDemoUser()\">\n                Skip\n            </button>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/login/register-companies.html","<ion-view class=\"register\" title=\"Companies\">\n    <ion-content has-header=\"true\" class=\"has-subheader\" padding=\"true\">\n        \n        <div>\n            <companies/>\n        </div>\n        <button ng-click=\"next()\" class=\"button button-block button-positive\">\n            Continue >>\n        </button>\n    </ion-content>\n    <wg-company-footer wg-draggable-footer></wg-company-footer>\n</ion-view>\n");
$templateCache.put("templates/login/register-target-hours.html","<ion-view class=\"register\" title=\"Register\">\n    <ion-content has-header=\"true\" class=\"has-subheader\" padding=\"true\">\n\n        <div class=\"padding-bottom\">\n            <target-controls/>\n        </div>\n        <div class=\"padding\">\n            <button ng-click=\"next()\" class=\"button button-block button-positive\">\n                Continue >>\n            </button>\n        </div>\n    </ion-content>\n</ion-view>\n\n\n\n");
$templateCache.put("templates/login/register-work-types.html","<ion-view class=\"register\" title=\"Work\">\n    <ion-content has-header=\"true\" class=\"has-subheader\" padding=\"true\">\n        \n        <div>\n            <work-types/>\n        </div>\n        <button ng-click=\"next()\" class=\"button button-block button-positive\">\n            Continue >>\n        </button>\n    </ion-content>\n    <wg-work-types-footer wg-draggable-footer></wg-work-types-footer>\n</ion-view>\n");
$templateCache.put("templates/login/tabs.html","<ion-nav-bar class=\"bar-positive\">\n      <ion-nav-back-button>\n      </ion-nav-back-button>\n      <ion-header-bar class=\"bar-subheader\" ng-class=\"{\'slide-up\' : currentPage === -1}\">\n        <wg-pager/>\n      </ion-header-bar>\n</ion-nav-bar>\n<!--\nCreate tabs with an icon and label, using the tabs-positive style.\nEach tab\'s child <ion-nav-view> directive will have its own\nnavigation history that also transitions its views in and out.\n-->\n<ion-tabs class=\"tabs-color-active-positive\" ng-class=\"{\'tabs-hide\' : currentPage > 0}\">\n\n  <!-- Dashboard Tab -->\n  <ion-tab title=\"Login\" href=\"#/tab/login\">\n    <ion-nav-view name=\"tab-login\"></ion-nav-view>\n  </ion-tab>\n\n  <!-- Chats Tab -->\n  <ion-tab title=\"Register\" href=\"#/tab/register-account-info\">\n    <ion-nav-view name=\"tab-register\"></ion-nav-view>\n  </ion-tab>\n\n</ion-tabs>\n");
$templateCache.put("templates/main/availability-page.html","<ion-view view-title=\"Availability\">\n<!-- class=\"has-tabs\" -->\n	<ion-content>\n		\n		<grid-days></grid-days>\n\n	</ion-content>\n    <!-- <div class=\"tabs\">\n        <a class=\"tab-item active\">\n            Add Days\n        </a>\n        <a class=\"tab-item\" ng-click=\"toggleWithoutAnimation(\'app.block-days-page\')\">\n            Block Out Days\n        </a>\n    </div> -->\n</ion-view>\n");
$templateCache.put("templates/main/available-shifts-page.html","<ion-view view-title=\"Available Shifts\">\n    <ion-content>\n    <div class=\"shifts\">\n	    <div ng-repeat=\"shift in shifts\">\n	        <shift/>\n	    </div>\n	</div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/main/block-days-page.html","<ion-view view-title=\"Availability\">\n	<!-- <ion-header-bar flex-calendar-subheader class=\"bar-subheader custom-subheader\">\n		<flex-calendar options=\"options\" events=\"shifts\"></flex-calendar>\n	</ion-header-bar> -->\n\n	<ion-content class=\"has-tabs\">\n\n		<div class=\"wg-title\">\n	        <p>Simply tap on the days that you\'re unable to work and we\'ll block them out. ANy shifts within 72 hours must be cancelled through the schedule page</p>\n	    </div>\n	</ion-content>\n    <div class=\"tabs\">\n        <a class=\"tab-item\" ng-click=\"toggleWithoutAnimation(\'app.availability-page\')\">\n            Add Days\n        </a>\n        <a class=\"tab-item active\">\n            Block Out Days\n        </a>\n    </div>\n</ion-view>\n");
$templateCache.put("templates/main/companies-page.html","<ion-view view-title=\"Copmanies\">\n    <ion-content>\n        <companies/>\n    </ion-content>\n    <wg-company-footer wg-draggable-footer></wg-company-footer>\n</ion-view>\n");
$templateCache.put("templates/main/earnings-page.html","<ion-view view-title=\"Earnings\">\n    <ion-content class=\"has-header has-tabs\">\n\n        <div class=\"center-text\">\n            <wg-line-header title=\"Today\"> </wg-line-header>\n            <h2>\n                {{188 | currency:undefined:0}}\n            </h2>\n\n            <wg-line-header title=\"This Week\"> </wg-line-header>\n            <h2>\n                {{ 720 | currency:undefined:0}}\n            </h2>\n\n            <wg-line-header title=\"This Month\"> </wg-line-header>\n            <h2>\n                {{ 2410 | currency:undefined:0}}\n            </h2>\n\n            <wg-line-header title=\"Lifetime\"> </wg-line-header>\n            <h2>\n                {{ 11002 | currency:undefined:0}}\n            </h2>\n        </div>\n    </ion-content>\n    <div class=\"tabs tabs-icon-left\">\n        <a class=\"tab-item active\">\n            <i class=\"icon ion-cash\"></i> Earnings\n        </a>\n        <a class=\"tab-item\" ng-click=\"toggleWithoutAnimation(\'app.hours-page\')\">\n            <i class=\"icon ion-clock\"></i> Hours\n        </a>\n    </div>\n</ion-view>\n");
$templateCache.put("templates/main/forgot-password-page.html","<ion-view title=\"Forgot Password\">\n    <ion-content ng-show=\"!state.success\" has-header=\"true\" has-tabs=\"true\" padding=\"true\">\n        <div class=\"list\">\n            <label class=\"item item-input\">\n                <input type=\"email\" ng-model=\"user.email\" placeholder=\"Enter your email\">\n            </label>\n        </div>\n        <div class=\"assertive\" ng-show=\"error.message\">{{error.message}}</div>\n        <button class=\"button button-block button-positive\" ng-click=\"reset()\">\n            RESET PASSWORD\n        </button>\n    </ion-content>\n    <ion-content ng-show=\"state.success\" has-header=\"true\" has-tabs=\"true\" padding=\"true\">\n        <div class=\"positive\">An email has been sent to you with instructions on resetting your password.</div>\n        <button class=\"button button-block button-clear button-calm\" ng-click=\"login()\">\n            Log In\n        </button>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/main/hours-page.html","<ion-view view-title=\"Hours\">\n    <ion-content class=\"has-header has-tabs\">\n\n        <div class=\"center-text\">\n            <wg-line-header title=\"Today\"> </wg-line-header>\n            <h2>\n                {{8}}\n        </h2>\n            <wg-line-header title=\"This Week\"> </wg-line-header>\n            <h2>\n                {{31}}\n        </h2>\n            <wg-line-header title=\"This Month\"> </wg-line-header>\n            <h2>\n                {{130}}\n        </h2>\n            <wg-line-header title=\"Lifetime\"> </wg-line-header>\n            <h2>\n                {{846}}\n        </h2>\n        </div>\n    </ion-content>\n    <div class=\"tabs tabs-icon-left\">\n        <a class=\"tab-item\" ng-click=\"toggleWithoutAnimation(\'app.earnings-page\')\">\n            <i class=\"icon ion-cash\"></i> Earnings\n        </a>\n        <a class=\"tab-item active\">\n            <i class=\"icon ion-clock\"></i> Hours\n        </a>\n    </div>\n</ion-view>\n");
$templateCache.put("templates/main/preferences-page.html","<ion-view view-title=\"Preferences\">\n	<ion-content class=\"wg-preferences-page\">\n\n		<p class=\"wg-list-title\">Work Preferences</p>\n\n		<ion-list type=\"card\">\n			<ion-item href=\"#/app/target-page\">\n			   Weekly Hours Target\n				<span class=\"item-note\">\n					Set at: {{currentUser.hourlyTarget}}\n				</span>\n			</ion-item>\n\n			<ion-item href=\"#/app/companies-page\">\n			   My Companies\n				<span class=\"item-note\">\n					<span ng-repeat= \"(company, value) in currentUser.companies | truncateObj : 2\">{{company}}{{$last || $middle ? \'\' : \', \'}}</span>\n				</span>\n			</ion-item>\n\n			<ion-item href=\"#/app/work-types-page\">\n			   Types of Work\n				<span class=\"item-note\">\n					<span ng-repeat= \"(workType, value) in currentUser.workTypes | truncateObj : 2\">{{workType}}{{$last || $middle ? \'\' : \', \'}}</span>\n				</span>\n			</ion-item>\n\n			<ion-item href=\"#/app/availability-page\">\n			   Manage Availability\n				<span class=\"item-note\">\n					{{currentUser.totalHours}} {{currentUser.totalHours == 1 ? \'Hour\' : \'Hours\'}}\n				</span>\n			</ion-item>\n\n			<ion-item href=\"#/app/vehicles-page\">\n			   Vehicle Type\n				<span class=\"item-note\">\n					<span ng-repeat=\"vehicle in currentUser.vehicles | filter:{ selected: true }\" >{{vehicle.name}}{{$last ? \'\' : \', \'}}</span>\n				</span>\n			</ion-item>\n\n		</ion-list>\n\n		<p class=\"wg-list-title\">Personal Information</p>\n\n		<ion-list type=\"card\">\n			<ion-item class=\"item-input-element\">\n			   <input type=\"text\" ng-model=\"currentUser.name\">\n			</ion-item>\n\n			<ion-item class=\"item-input-element\">\n			   <input class=\"input-phone\" type=\'text\' phone-input ng-model=\"phoneVal\" ng-model=\"phoneVal\"/>\n			</ion-item>\n\n			<ion-item class=\"item-input-element\">\n			   <input type=\"text\" ng-model=\"currentUser.email\">\n			</ion-item>\n\n		</ion-list>\n\n		<ion-list type=\"card\">\n			<!-- add ng-show=\"currentUser\" if needed -->\n			<ion-item class=\"item-icon-right assertive\" ng-click=\"logout()\">\n	          Logout\n	          <i class=\"icon ion-log-out\"></i>\n	        </ion-item>\n		</ion-list>\n\n	</ion-content>\n</ion-view>\n");
$templateCache.put("templates/main/schedule-calendar-page.html","<ion-view ng-controller=\"ScheduleCtrl\" view-title=\"{{selectedMonth | uppercase | translate}}\" right-buttons=\"myRightButtons\">\n\n	<ion-header-bar flex-calendar-subheader class=\"bar-subheader custom-subheader\">\n		<flex-calendar options=\"options\" events=\"shifts\"></flex-calendar>\n	</ion-header-bar>\n\n    <ion-content class=\"has-flex-calendar-subheader\" >\n	        <shift-list></shift-list>\n\n		    <ion-item id=\"empty-shift-list\" class=\"item-avatar\" ng-repeat=\"empty in [1,2]\">\n		        {{$first && !groupedShifts.length ? \'No shifts to show\' : \'\'}}\n		    </ion-item>\n\n	</ion-content>\n</ion-view>");
$templateCache.put("templates/main/schedule-list-page.html","<ion-view ng-controller=\"ScheduleCtrl\" view-title=\"Schedule\">\n    <ion-content>\n        <!-- Schedule of events -->\n        <shift-list/>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/main/target-page.html","<ion-view view-title=\"Weekly Target\">\n	<ion-content>\n		<target-controls/>\n	</ion-content>\n</ion-view>\n");
$templateCache.put("templates/main/vehicles-page.html","<ion-view view-title=\"Vehicles\">\n    <ion-content>\n        <ion-list>\n            <ion-item class=\"item-checkbox item-icon-right\" ng-repeat=\"vehicle in currentUser.vehicles\">\n                <label class=\"checkbox\">\n                    <input type=\"checkbox\" ng-change=\"update()\" ng-model=\"vehicle.selected\">\n                </label>\n                {{vehicle.name}}\n                <i class=\"icon {{vehicle.icon}}\"></i>\n            </ion-item>\n        </ion-list>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/main/work-types-page.html","<ion-view view-title=\"Types of Work\">\n    <ion-content>\n        <work-types/>\n    </ion-content>\n    <wg-work-types-footer wg-draggable-footer></wg-work-types-footer>\n</ion-view>\n");
$templateCache.put("templates/shared/accept-shift.html","<ion-modal-view>\n  <ion-header-bar>\n\n\n    <h1 class=\"title\">Shift Details</h1>\n\n\n  </ion-header-bar>\n  <ion-content class=\"padding\">\n\n  <ul >\n    <h2 class=\"wg-center-header\">Are you sure you want to accept this shift?</h1>\n    <h4 class=\"wg-blue wg-tiny\">Requested By</h4>\n    <h3>{{selectedShift.name}}</h3>\n\n    <h4 class=\"wg-blue wg-tiny\">Shift Information</h4>\n    <p>\n        {{selectedShift.startsAt.getTime() | date:\'mediumDate\'}} | {{selectedShift.startsAt.getTime() | date:\'shortTime\'}} - {{selectedShift.endsAt.getTime() | date:\'shortTime\'}}\n    </p>\n\n    <p>Earnings Est: <span class=\"light-green\">{{(selectedShift.endsAt.getTime() - selectedShift.startsAt.getTime())/3600000 * hourlyRate | currency:undefined:0}}</span></p>\n\n    <h4 class=\"wg-blue wg-tiny\">Company</h4>\n    <h3>{{selectedShift.company | capitalize}}</h3>\n\n    <div class=\"wg-buttons-line\">\n      <button class=\"button button-positive\" ng-click=\"acceptShift(currentShift)\">Accept</button>\n      <button class=\"button button-assertive button-outline\" ng-click=\"declineShift(currentShift)\">\n        Decline\n      </button>\n    </div>\n\n  </ul>\n\n  </ion-content>\n</ion-modal-view>\n");
$templateCache.put("templates/shared/cancel-shift-popup.html","<h1>Are you sure you want to cancel the following shift?</h1>\n\n<p>Late cancellations this quarter: {{cancellations}}/3</p>\n\n<img ng-src=\"img/companies/{{shift.company.toLowerCase()}}.png\" alt=\"\">\n<p class=\"schedule-time\">\n    <standard-time-meridian etime=\'shift.startsAt.getHours()*3600\'></standard-time-meridian> -\n    <standard-time-meridian etime=\'shift.endsAt.getHours()*3600\'></standard-time-meridian>\n</p>");
$templateCache.put("templates/shared/colorDivider.html","<div class=\"color-divider\">\n	<span></span>\n	<span></span>\n	<span></span>\n	<span></span>\n	<span></span>\n	<span></span>\n</div>");
$templateCache.put("templates/shared/companies.html","<div class=\"wg-grid\">\n    <div class=\"wg-title\">\n        <p>Select the companies you are eligible to work for.</p>\n    </div>\n	<div class=\"row padding-top\" ng-repeat=\"rows in chunkedCompanies\">\n	    <div class=\"col\" ng-repeat=\"key in rows\" ng-click=\"select(key)\" ng-class=\"currentUser.companies.{{key}} ? \'selected\' : \'\'\">\n	        <img ng-src=\"img/companies/{{key}}.png\" alt=\"\">\n	    </div>\n	</div>\n</div>");
$templateCache.put("templates/shared/contact-us.html","<ion-modal-view>\n    <ion-header-bar>\n        <div class=\"buttons\">\n            <button class=\"button button-positive button-clear\" ng-click=\"cancelMessage()\">\n                Cancel\n            </button>\n        </div>\n        <h1 class=\"title\">Contact Us</h1>\n        <!-- <div class=\"buttons\">\n            <button menu-toggle=\"left\" class=\"button button-positive\" ng-click=\"sendMessage()\">Send</button>\n        </div> -->\n    </ion-header-bar>\n    <ion-content class=\"contact-us-content\">\n        <p class=\"wg-title extra-padding-top\">\n            Put anything you want to ask us in here and hit send!\n        </p>\n        <label class=\"item item-input item-stacked-label readonly\">\n	        <span class=\"input-label\">From</span>\n            <input type=\"text\" placeholder=\"First Name\" value=\"{{currentUser.name}}\" readonly=\"true\">\n        </label>\n        <label class=\"item item-input item-floating-label contact-message\">\n            <span class=\"input-label\">Message</span>\n            <textarea rows=\"5\" placeholder=\"Type your message here. Any questions, comments or concerns you may have.\"></textarea>\n        </label>\n        <div class=\"padding\">\n            <button class=\"button button-positive button-block\" ng-click=\"sendMessage()\">Send</button>\n        </div>\n        <div class=\"wg-title\">\n            <p>Is it an emergency?</p>\n            <a href=\"tel:+14153471890\"><button class=\"button button-clear button-assertive icon-left ion-ios-telephone\">Call Us</button></a>\n        </div>\n    </ion-content>\n</ion-modal-view>\n");
$templateCache.put("templates/shared/days.html","<div class=\"days\">\n\n    <div class=\"wg-title\">\n        <p>tap on the (+) sign on the day you want to set your availability.</p>\n        <p>You can add as many hours as you like!</p>\n\n        <strong ng-class=\"currentUser.totalHours === 0 ? \'wg-red\' : \'wg-blue\'\">Total: {{currentUser.totalHours}} {{currentUser.totalHours == 1 ? \'Hour\' : \'Hours\'}}</strong>\n    </div>\n\n    <div ng-repeat=\"day in days\">\n        <ion-item class=\"item-divider\">\n            {{day | capitalize}}\n        </ion-item>\n        <ion-item ng-repeat = \"(key, schedule) in currentUser.availability[day]\" class=\"item item-icon-left\">\n            <i class=\"icon ion-ios-minus-outline assertive\" ng-click=\"deleteSchedule(schedule)\" ></i>\n            <div ng-click=\"editSchedule(day, schedule)\">\n                <span>\n                    <standard-time-meridian etime=\'schedule.startsAt.inputEpochTime\'/>,\n                </span>\n                -\n                <span>\n                    <standard-time-meridian etime=\'schedule.endsAt.inputEpochTime\'/>\n                </span>\n            </div>\n        </ion-item>\n        <ion-item class=\"item item-icon-left\" ng-click=\"editSchedule(day)\">\n            <i class=\"icon ion-ios-plus-outline positive\"></i>\n        </ion-item>\n    </div>\n</div>");
$templateCache.put("templates/shared/grid-days.html","<div class=\"days\">\n    <div class=\"wg-title\">\n        <p>This is your availability matrix. Simply tap on the fields that you are available to work and it\'ll let our scheduler know when to best assign your shifts. To block out specific days, tap on \"block out days\" below.</p>\n    </div>\n    <div class=\"wg-grid-days\">\n        <div class=\"row\">\n            <div class=\"col\">All</div>\n            <div class=\"col\" ng-repeat=\"int in intervals\">{{int}}</div>\n        </div>\n        <div class=\"row\" ng-repeat=\"day in days\">\n            <div class=\"col\">{{day}}</div>\n            <div class=\"col\" ng-class=\"currentUser.availabilityGrid[day][i] ? \'selected\' : \'\'\" ng-repeat=\"(i, v) in intervals\" ng-click=\"select(day, i)\"></div>\n        </div>\n    </div>\n</div>");
$templateCache.put("templates/shared/shift-list.html","<div ng-repeat=\"group in groupedShifts\">\n    <div class=\"group-list\">\n        <ion-list>\n            <ion-item id=\"{{anchroID(group)}}\" class=\"item-divider\" ion-affix data-affix-within-parent-with-class=\"group-list\">\n                {{dividerFunction(group[0].startsAt)}}\n                <!-- <span>Total est: <i class=\"light-green\">{{groupEarnings(group) | currency:undefined:0}}</i></span> -->\n            </ion-item>\n            <ion-item class=\"item-avatar item-company-icon\" bounce-left ng-repeat=\"shift in group\" can-swipe=\"true\">\n                <img ng-src=\"img/companies/{{shift.company.toLowerCase()}}.png\">\n                <div class=\"schedule-text\">\n                    <p>\n                        {{shift.company}}\n                    </p>\n                    <p class=\"schedule-time\">\n                        <standard-time-meridian etime=\'shift.startsAt.getHours()*3600\'></standard-time-meridian> -\n                        <standard-time-meridian etime=\'shift.endsAt.getHours()*3600\'></standard-time-meridian>\n                    </p>\n                </div>\n                <span class=\"item-note\">\n                  earnings est: <i class=\"light-green\">{{(shift.endsAt.getTime() - shift.startsAt.getTime())/3600000 * hourlyRate | currency:undefined:0}}</i>\n                </span>\n                <ion-option-button class=\"button-info\" ng-click=\"goToApp(shift)\">\n                    App\n                </ion-option-button>\n                <!-- <ion-option-button class=\"button-positive\" ng-click=\"tradeShift(shift)\">\n                    Trade\n                </ion-option-button> -->\n                <ion-option-button class=\"button-assertive\" ng-click=\"cancelWarning(shift, group, groupedShifts)\">\n                    Cancel\n                </ion-option-button>\n            </ion-item>\n        </ion-list>\n    </div>\n</div>");
$templateCache.put("templates/shared/shift.html","<div class=\"shift\">\n    <div class=\"row shift-title\">\n        <div class=\"col\">\n            <p class=\"shift-header\">requested by</p>\n            <p class=\"shift-name\">{{shift.name}}</p>\n        </div>\n        <div>\n            <p class=\"shift-header\">shift date</p>\n            <p class=\"shift-date\">\n                {{shift.startsAt.getTime() | date:\'mediumDate\'}}\n            </p>\n            <p class=\"shift-earnings\">Earnest Est: <span class=\"light-green\">{{(shift.endsAt.getTime() - shift.startsAt.getTime())/3600000 * hourlyRate | currency:undefined:0}}</span></p>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"col box-outline img-box\">\n            <img ng-src=\"./img/companies/{{shift.company}}.png\" alt=\"\">\n            <p>{{shift.company | capitalize}}</p>\n        </div>\n        <div class=\"col box-outline time-box\">\n            <p>from</p>\n            <h4>\n                <standard-time-meridian etime=\'shift.startsAt.getHours()*3600\'></standard-time-meridian>\n            </h4>\n            <p>to</p>\n            <h4>\n            <standard-time-meridian etime=\'shift.endsAt.getHours()*3600\'></standard-time-meridian>\n            </h4>\n        </div>\n        <div class=\"col box-outline\">\n            <button ng-click=\"accept(shift)\" class=\"button button-small button-positive\">\n                Accept\n            </button>\n            <button class=\"button button-small button-stable\">\n                Decline\n            </button>\n        </div>\n    </div>\n</div>\n<color-divider/>");
$templateCache.put("templates/shared/targetControls.html","<div class=\"weeklyTarget padding-top\">\n	<p class=\"wg-title\">How many hours would you <strong>like</strong> to work per week?</p>\n	<p class= \"weekly-hours light-blue\">{{currentUser.hourlyTarget}}</p>\n	<div class=\"item range\">\n		0\n		<input type=\"range\" ng-model=\"currentUser.hourlyTarget\" name=\"hours\" ng-change=\"update(currentUser.hourlyTarget)\" min=\"0\" max=\"80\">\n		80\n	</div>\n	<p class=\"small-light\">Earnings estimate</p>\n\n	\n	<div class=\"currency-wrapper padding\">\n		<p class= \"currency-estimate light-green\">{{currentUser.hourlyTarget * hourlyRate | currency:undefined:0}} </p>\n		<span class=\"earning-label-right\">weekly</span>\n	</div>\n	<p class=\"padding-top\"></p>\n	\n	<div class=\"currency-wrapper padding\">\n		<p class= \"currency-estimate light-green\">{{currentUser.hourlyTarget * hourlyRate / 7 * 30 | currency:undefined:0}} </p>\n		<span class=\"earning-label-right\">monthly</span>\n	</div>\n</div>");
$templateCache.put("templates/shared/wg-company-footer.html","<div class=\"bar bar-footer wg-company-footer\" ng-class=\"selectedCompany.selected ? \'wg-footer-selected\' : \'\'\">\n    <img ng-src=\"img/companies/{{selectedCompany.name}}.png\" alt=\"\">\n    <p>{{selectedCompany.description}}</p>\n</div>");
$templateCache.put("templates/shared/wg-line-header.html","<div class=\"wg-line-header\">\n	<span class=\"wg-dash\"></span>\n	<span class=\"wg-dot\"></span>\n	<h4>{{title}}</h4>\n	<span class=\"wg-dot\"></span>\n	<span class=\"wg-dash\"></span>\n</div>");
$templateCache.put("templates/shared/wg-pager.html","<div class=\"wg-pager\">\n    <span ng-repeat=\"(id, item) in pages\" ng-class=\"currentPage == id ? \'wg-pager-selected\' : \'\'\">\n      <span class=\"wg-circle\">\n        {{id + 1}}\n      </span>\n      <span ng-hide=\"$last\" class=\"wg-dash\">\n   \n      </span>\n    </span>    \n</div>");
$templateCache.put("templates/shared/wg-profile-photo.html","<div class=\"wg-profile-wrapper\">\n	<div class=\"wg-profile-photo\"ng-click=\"changePhoto()\" ng-style=\"{\'background-image\':\'url(\'+imageURL+\')\'}\"></div>\n</div>");
$templateCache.put("templates/shared/wg-work-types-footer.html","<ion-footer-bar class=\"wg-work-types-footer\" ng-class=\"selectedWorkType.selected ? \'wg-footer-selected\' : \'\'\">\n    <i class=\"icon\" ng-class=\"selectedWorkType.icon\"></i>\n    <p>{{selectedWorkType.description}}</p>\n</ion-footer-bar>");
$templateCache.put("templates/shared/work-types.html","<div class=\"wg-grid\">\n    <div class=\"center-text padding\">\n        <p>Select the types of work that you are interested in. bear in mind that Ridesharing and certain delivery jobs require a car!</p>\n    </div>\n    <div class=\"row padding-top\" ng-repeat=\"rows in workTypes\">\n        <div class=\"col light-blue\" ng-repeat=\"item in rows\" ng-click=\"select(item.name)\" ng-class=\"currentUser.workTypes.{{item.name}} ? \'selected\' : \'\'\">\n            <i class=\"icon\" ng-class=\"item.icon\"></i>\n            <p>{{item.name}}</p>\n        </div>\n    </div>\n</div>\n");}]);