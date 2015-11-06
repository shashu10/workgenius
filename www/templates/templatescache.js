angular.module("templatescache", []).run(["$templateCache", function($templateCache) {$templateCache.put("templates/menu.html","<ion-side-menus enable-menu-with-back-views=\"false\">\n  <ion-side-menu-content>\n    <ion-nav-bar class=\"bar-positive\">\n      <ion-nav-back-button>\n      </ion-nav-back-button>\n\n      <ion-nav-buttons side=\"left\">\n        <button class=\"button button-icon button-clear ion-lightbulb\" menu-toggle=\"left\">\n        </button>\n      </ion-nav-buttons>\n      <ion-nav-buttons side=\"right\">\n        <button class=\"button button-icon button-clear\" ng-show=\"showRightIcon\" ng-class=\"showCalendarIcon ? \'ion-ios-calendar-outline\' : \'ion-ios-list-outline\'\"\n        ng-click=\"showCalendarIcon ? showScheduleCalendar() : showScheduleList()\">\n        </button>\n      </ion-nav-buttons>\n\n    </ion-nav-bar>\n    <ion-nav-view name=\"menuContent\"></ion-nav-view>\n  </ion-side-menu-content>\n\n  <ion-side-menu side=\"left\" expose-aside-when=\"large\">\n\n    <ion-content class=\"padding-top\">\n      <div><wg-profile-photo/></div>\n      <h4 class=\"wg-user-name\">{{currentUser.name}}</h4>\n      <ion-list>\n        <ion-item class=\"item-icon-left\" menu-close href=\"#/app/schedule-calendar-page\">\n          <i class=\"icon ion-calendar\"></i>\n          Schedule\n        </ion-item>\n        <ion-item class=\"item-icon-left\" menu-close href=\"#/app/available-shifts-page\">\n          <i class=\"icon ion-network\"></i>\n          Available Shifts\n        </ion-item>\n        <ion-item class=\"item-icon-left\" menu-close href=\"#/app/earnings-page\">\n          <i class=\"icon ion-cash\"></i>\n          Earnings\n        </ion-item>\n        <ion-item class=\"item-icon-left\" menu-close href=\"#/app/preferences-page\">\n          <i class=\"icon ion-ios-gear-outline\"></i>\n          Preferences\n        </ion-item>\n      </ion-list>\n    </ion-content>\n  </ion-side-menu>\n</ion-side-menus>\n");
$templateCache.put("templates/login/login-tab.html","<ion-view view-title=\"Login\">\n    <ion-content has-header=\"true\" has-tabs=\"true\">\n        <div class=\"list\">\n            <label class=\"item item-input\">\n                <!-- <span class=\"input-label\"> Email</span> -->\n                <i class=\"icon ion-email placeholder-icon\"></i>\n                <input placeholder=\"Email\" type=\"email\" ng-model=\"user.email\">\n            </label>\n            <label class=\"item item-input\">\n                <!-- <span class=\"input-label\"> Password</span> -->\n                <i class=\"icon ion-lock-combination placeholder-icon\"></i>\n                <input placeholder=\"Password\" type=\"password\" ng-model=\"user.password\">\n            </label>\n        </div>\n        <div class=\"assertive padding-left\" ng-show=\"error.message\">{{error.message}}</div>\n        <div class=\"padding\">\n            <button class=\"button button-block button-positive\" ng-click=\"login()\">\n                LOG IN\n            </button>\n        </div>\n        <button class=\"button button-block button-clear button-calm\" ng-click=\"forgot()\">\n            Forgot your password?\n        </button>\n\n        <button class=\"button button-block button-clear button-calm\" ng-click=\"loginDemoUser()\">\n            Skip\n        </button>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/login/register-account-info.html","<ion-view class=\"register\" title=\"Register\">\n    <ion-content has-header=\"true\" class=\"has-subheader has-pagerheader\" has-tabs=\"true\">\n        <div class=\"list\">\n            <label class=\"item item-input\">\n                <i class=\"icon ion-person placeholder-icon\"></i>\n                <input type=\"text\" ng-model=\"user.name\" placeholder=\"Name\">\n            </label>\n            <label class=\"item item-input\">\n                <i class=\"icon ion-email placeholder-icon\"></i>\n                <input type=\"email\" ng-model=\"user.email\" placeholder=\"Email\">\n            </label>\n            <label class=\"item item-input\">\n                <i class=\"icon ion-lock-combination placeholder-icon\"></i>\n                <input type=\"password\" ng-model=\"user.password\" placeholder=\"Password\">\n            </label>\n            <label class=\"item item-input\">\n                <i class=\"icon ion-lock-combination placeholder-icon\"></i>\n                <input type=\"password\" ng-model=\"user.password1\" placeholder=\"Confirm Password\">\n            </label>\n            <div class=\"padding\">\n                <button ng-click=\"next()\" class=\"button button-block button-positive\">\n                    Continue >>\n                </button>\n            </div>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/login/register-companies.html","<ion-view class=\"register\" title=\"Companies\">\n    <ion-content has-header=\"true\" class=\"has-subheader has-pagerheader\" has-tabs=\"true\" padding=\"true\">\n        \n        <div ng-controller=\"CompaniesCtrl\">\n            <companies/>\n        </div>\n        <button ng-click=\"next()\" class=\"button button-block button-positive\">\n            Continue >>\n        </button>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/login/register-schedule.html","<ion-view class=\"register\" title=\"Availability\">\n    <ion-content has-header=\"true\" class=\"has-subheader has-pagerheader\" has-tabs=\"true\">\n\n        <div ng-controller=\"AvailabilityCtrl\">\n            <days/>\n        </div>\n		<div class=\"padding\">\n	        <button ng-click=\"next()\" class=\"button button-block button-positive\">\n	            Continue >>\n	        </button>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/login/register-target-hours.html","<ion-view class=\"register\" title=\"Register\">\n    <ion-content has-header=\"true\" class=\"has-subheader has-pagerheader\" has-tabs=\"true\" padding=\"true\">\n\n        <div class=\"padding-bottom\">\n            <p>Finally, how many hours would you <strong>like</strong> to work per week?</p>\n            <target-controls/>\n        </div>\n\n        <!-- Signup -->\n        <div>\n            <div class=\"assertive\" ng-show=\"error.message\">{{error.message}}</div>\n            <button class=\"button button-block button-positive\" ng-click=\"register()\">\n                Finish >>\n            </button>\n            By creating an account you agree to the Terms of Use and Privacy Policy.\n        </div>\n    </ion-content>\n</ion-view>\n\n\n\n");
$templateCache.put("templates/login/tabs.html","<ion-nav-bar class=\"bar-positive\">\n      <ion-nav-back-button>\n      </ion-nav-back-button>\n</ion-nav-bar>\n<div class=\"bar bar-subheader wg-pager-header\" ng-show=\"currentPage > -1\">\n  <wg-pager/>\n</div>\n<!--\nCreate tabs with an icon and label, using the tabs-positive style.\nEach tab\'s child <ion-nav-view> directive will have its own\nnavigation history that also transitions its views in and out.\n-->\n<ion-tabs class=\"tabs-color-active-positive\">\n\n  <!-- Dashboard Tab -->\n  <ion-tab title=\"Login\" href=\"#/tab/login\">\n    <ion-nav-view name=\"tab-login\"></ion-nav-view>\n  </ion-tab>\n\n  <!-- Chats Tab -->\n  <ion-tab title=\"Register\" href=\"#/tab/register-account-info\">\n    <ion-nav-view name=\"tab-register\"></ion-nav-view>\n  </ion-tab>\n\n</ion-tabs>\n");
$templateCache.put("templates/main/availability-page.html","<ion-view view-title=\"Availability\">\n	<ion-content>\n		<days/>\n	</ion-content>\n</ion-view>\n");
$templateCache.put("templates/main/available-shifts-page.html","<ion-view view-title=\"Available Shifts\">\n    <ion-content>\n    <div class=\"shifts\">\n	    <div ng-repeat=\"shift in shifts\">\n	        <shift/>\n	    </div>\n	</div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/main/companies-page.html","<ion-view view-title=\"Availability\">\n	<ion-content>\n		<companies/>\n	</ion-content>\n</ion-view>");
$templateCache.put("templates/main/earnings-page.html","<ion-view view-title=\"Earnings\" left-buttons=\"leftButtons\">\n    <ion-content class=\"has-header\">\n\n        <div><wg-profile-photo/></div>\n        \n        <h4 class=\"wg-user-name\">{{currentUser.name}}</h4>\n\n        <div class=\"wg-earnings-toggler\">\n            <span ng-class=\"{wgBlueBack: !toggle}\" ng-click=\"toggle = false\">\n                Earnings\n            </span>\n            <span ng-class=\"{wgYellowBack: toggle}\" ng-click=\"toggle = true\">\n                Hours\n            </span>\n        </div>\n        <div title=\"Earnings\" icon=\"ion-cash\" ng-hide=\"toggle\">\n            <div class=\"earnings center-text\">\n            	<h4>Today</h4>\n                <h2>\n	                {{188 | currency:undefined:0}}\n                </h2>\n                <h4>This Week</h4>\n                <h2>\n	                {{ 720 | currency:undefined:0}}\n                </h2>\n                <h4>This Month</h4>\n                <h2>\n	                {{ 2410 | currency:undefined:0}}\n                </h2>\n                <h4>Lifetime</h4>\n                <h2>\n	                {{ 11002 | currency:undefined:0}}\n                </h2>\n            </div>\n        </div>\n\n        <div title=\"Hours\" icon=\"ion-clock\" ng-show=\"toggle\">\n			<div class=\"hours center-text\">\n				<h4>Today</h4>\n                <h2>\n	                {{8}}\n                </h2>\n                <h4>This Week</h4>\n                <h2>\n	                {{31}}\n                </h2>\n                <h4>This Month</h4>\n                <h2>\n	                {{130}}\n                </h2>\n                <h4>Lifetime</h4>\n                <h2>\n	                {{846}}\n                </h2>\n			</div>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/main/forgot-password-page.html","<ion-view title=\"Forgot Password\">\n    <ion-content ng-show=\"!state.success\" has-header=\"true\" has-tabs=\"true\" padding=\"true\">\n        <div class=\"list\">\n            <label class=\"item item-input\">\n                <input type=\"email\" ng-model=\"user.email\" placeholder=\"Enter your email\">\n            </label>\n        </div>\n        <div class=\"assertive\" ng-show=\"error.message\">{{error.message}}</div>\n        <button class=\"button button-block button-positive\" ng-click=\"reset()\">\n            RESET PASSWORD\n        </button>\n    </ion-content>\n    <ion-content ng-show=\"state.success\" has-header=\"true\" has-tabs=\"true\" padding=\"true\">\n        <div class=\"positive\">An email has been sent to you with instructions on resetting your password.</div>\n        <button class=\"button button-block button-clear button-calm\" ng-click=\"login()\">\n            Log In\n        </button>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/main/preferences-page.html","<ion-view view-title=\"Preferences\">\n	<ion-content>\n		<ion-list>\n			<ion-item href=\"#/app/target-page\">\n			   Weekly Hours Target\n				<span class=\"item-note\">\n					Set at: {{currentUser.hourlyTarget}}\n				</span>\n			</ion-item>\n\n			<ion-item href=\"#/app/companies-page\">\n			   My Companies\n				<span class=\"item-note\">\n					<span ng-repeat= \"(company, value) in currentUser.companies | truncateObj : 2\">{{company}}{{$last || $middle ? \'\' : \', \'}}</span>\n				</span>\n			</ion-item>\n\n			<ion-item href=\"#/app/availability-page\">\n			   Manage Availability\n				<span class=\"item-note\">\n					{{currentUser.totalHours}} {{currentUser.totalHours == 1 ? \'Hour\' : \'Hours\'}}\n				</span>\n			</ion-item>\n\n			<ion-item href=\"#/app/vehicles-page\">\n			   Vehicle Type\n				<span class=\"item-note\">\n					<span ng-repeat=\"vehicle in currentUser.vehicles | filter:{ selected: true }\" >{{vehicle.name}}{{$last ? \'\' : \', \'}}</span>\n				</span>\n			</ion-item>\n\n			<!-- add ng-show=\"currentUser\" if needed -->\n			<ion-item class=\"item-icon-right assertive\" ng-click=\"logout()\">\n	          Logout\n	          <i class=\"icon ion-log-out\"></i>\n	        </ion-item>\n\n		</ion-list>\n	</ion-content>\n</ion-view>\n");
$templateCache.put("templates/main/schedule-calendar-page.html","<ion-view ng-controller=\"ScheduleCtrl\" view-title=\"{{flexCtrl.selectedMonth | translate}}\" right-buttons=\"myRightButtons\">\n\n	<ion-header-bar custom-subheader class=\"bar-subheader\">\n		<flex-calendar options=\"options\" events=\"shifts\"></flex-calendar>\n	</ion-header-bar>\n	\n    <ion-content >\n\n        <!-- Schedule of events -->\n        <shift-list/>\n\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/main/schedule-list-page.html","<ion-view ng-controller=\"ScheduleCtrl\" view-title=\"Schedule\">\n    <ion-content>\n        <!-- Schedule of events -->\n        <shift-list/>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/main/target-page.html","<ion-view view-title=\"Weekly Target\">\n	<ion-content>\n		<target-controls/>\n	</ion-content>\n</ion-view>\n");
$templateCache.put("templates/main/vehicles-page.html","<ion-view view-title=\"Vehicles\">\n    <ion-content>\n        <ion-list>\n            <ion-item class=\"item-checkbox item-icon-right\" ng-repeat=\"vehicle in currentUser.vehicles\">\n                <label class=\"checkbox\">\n                    <input type=\"checkbox\" ng-change=\"update()\" ng-model=\"vehicle.selected\">\n                </label>\n                {{vehicle.name}}\n                <i class=\"icon {{vehicle.icon}}\"></i>\n            </ion-item>\n        </ion-list>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("templates/shared/accept-shift.html","<ion-modal-view>\n  <ion-header-bar>\n\n\n    <h1 class=\"title\">Shift Details</h1>\n\n\n  </ion-header-bar>\n  <ion-content class=\"padding\">\n\n  <ul >\n    <h2 class=\"wg-center-header\">Are you sure you want to accept this shift?</h1>\n    <h4 class=\"wg-blue wg-tiny\">Requested By</h4>\n    <h3>{{selectedShift.name}}</h3>\n\n    <h4 class=\"wg-blue wg-tiny\">Shift Information</h4>\n    <p>\n        {{selectedShift.startsAt.getTime() | date:\'mediumDate\'}} | {{selectedShift.startsAt.getTime() | date:\'shortTime\'}} - {{selectedShift.endsAt.getTime() | date:\'shortTime\'}}\n    </p>\n\n    <p>Earnings Est: <span class=\"light-green\">{{(selectedShift.endsAt.getTime() - selectedShift.startsAt.getTime())/3600000 * hourlyRate | currency:undefined:0}}</span></p>\n\n    <h4 class=\"wg-blue wg-tiny\">Company</h4>\n    <h3>{{selectedShift.company | capitalize}}</h3>\n\n    <div class=\"wg-buttons-line\">\n      <button class=\"button button-positive\" ng-click=\"acceptShift(currentShift)\">Accept</button>\n      <button class=\"button button-assertive button-outline\" ng-click=\"declineShift(currentShift)\">\n        Decline\n      </button>\n    </div>\n\n  </ul>\n\n  </ion-content>\n</ion-modal-view>\n");
$templateCache.put("templates/shared/colorDivider.html","<div class=\"color-divider\">\n	<span></span>\n	<span></span>\n	<span></span>\n	<span></span>\n	<span></span>\n	<span></span>\n</div>");
$templateCache.put("templates/shared/companies.html","<div class=\"companies\">\n	<div class=\"row\" ng-repeat=\"rows in chunkedCompanies\">\n	    <div class=\"col\" ng-repeat=\"key in rows\" ng-click=\"select(key)\">\n	        <img ng-class=\"currentUser.companies.{{key}} ? \'selected\' : \'\'\" ng-src=\"img/companies/{{key}}.png\" alt=\"\">\n	    </div>\n	</div>\n</div>");
$templateCache.put("templates/shared/days.html","<div class=\"days\">\n\n    <div class=\"title\">\n        <p>tap on the (+) sign on the day you want to set your availability.</p>\n        <p>You can add as many hours as you like!</p>\n\n        <strong ng-class=\"currentUser.totalHours === 0 ? \'wg-red\' : \'wg-blue\'\">Total: {{currentUser.totalHours}} {{currentUser.totalHours == 1 ? \'Hour\' : \'Hours\'}}</strong>\n    </div>\n\n    <div ng-repeat=\"day in days\">\n        <ion-item class=\"item-divider\">\n            {{day | capitalize}}\n        </ion-item>\n        <ion-item ng-repeat = \"(key, schedule) in currentUser.availability[day]\" class=\"item item-icon-left\">\n            <i class=\"icon ion-ios-minus-outline assertive\" ng-click=\"deleteSchedule(schedule)\" ></i>\n            <div ng-click=\"editSchedule(day, schedule)\">\n                <span>\n                    <standard-time-meridian etime=\'schedule.startsAt.inputEpochTime\'/>,\n                </span>\n                -\n                <span>\n                    <standard-time-meridian etime=\'schedule.endsAt.inputEpochTime\'/>\n                </span>\n            </div>\n        </ion-item>\n        <ion-item class=\"item item-icon-left\" ng-click=\"editSchedule(day)\">\n            <i class=\"icon ion-ios-plus-outline positive\"></i>\n        </ion-item>\n    </div>\n</div>");
$templateCache.put("templates/shared/newSchedule.html","<ion-modal-view>\n  <ion-header-bar>\n\n    <div class=\"buttons\">\n      <button class=\"button button-positive button-clear\" ng-click=\"discardDay()\">\n        Cancel\n      </button>\n    </div>\n\n    <h1 class=\"title\">{{schedule.day | capitalize}}s</h1>\n\n    <div class=\"buttons\">\n      <button class=\"button button-positive button-clear\" ng-click=\"saveDay()\">Accept</button>\n    </div>\n\n  </ion-header-bar>\n  <ion-content>\n\n  <ul>\n\n    <ionic-timepicker input-obj=\"schedule.startsAt\" class=\"item item-button-right\">\n      Starts\n        <standard-time-meridian etime=\'schedule.startsAt.inputEpochTime\' class=\"button button-positive button-clear\"/>\n    </ionic-timepicker>\n\n    <ionic-timepicker input-obj=\"schedule.endsAt\" class=\"item item-button-right\">\n      Ends\n        <standard-time-meridian etime=\'schedule.endsAt.inputEpochTime\' class=\"button button-positive button-clear\"/>\n    </ionic-timepicker>\n\n  </ul>\n\n  </ion-content>\n</ion-modal-view>\n");
$templateCache.put("templates/shared/shift-list.html","<!-- Schedule of shifts -->\n<ion-list ng-controller=\"ScheduleListCtrl\">\n    <div ng-repeat=\"group in groupedShifts\">\n        <ion-item class=\"item-divider\">\n            {{dividerFunction(group[0].startsAt)}}\n        </ion-item>\n        <ion-item class=\"item-avatar item-company-icon\" ng-repeat=\"shift in group\" can-swipe=\"true\">\n            <img ng-src=\"img/companies/{{shift.company.toLowerCase()}}.png\">\n            <!-- <i class=\"icon ion-earth\"></i> -->\n            <div class=\"schedule-text\">\n                <div>\n                    {{shift.company}}\n                </div>\n                <div class=\"schedule-time\">\n                    <standard-time-meridian etime=\'shift.startsAt.getHours()*3600\'></standard-time-meridian> -\n                    <standard-time-meridian etime=\'shift.endsAt.getHours()*3600\'></standard-time-meridian>\n                </div>\n            </div>\n            <span class=\"item-note earnings-estimate\">\n              earnings est: <i class=\"light-green\">{{(shift.endsAt.getTime() - shift.startsAt.getTime())/3600000 * hourlyRate | currency:undefined:0}}</i>\n            </span>\n            <ion-option-button class=\"button-info\" ng-click=\"goToApp(shift)\">\n                App\n            </ion-option-button>\n            <ion-option-button class=\"button-positive\" ng-click=\"tradeShift(shift)\">\n                Trade\n            </ion-option-button>\n            <ion-option-button class=\"button-assertive\" ng-click=\"deleteShift(shift, group, groupedShifts)\">\n                Delete\n            </ion-option-button>\n        </ion-item>\n    </div>\n</ion-list>\n");
$templateCache.put("templates/shared/shift.html","<div class=\"shift\">\n    <div class=\"row shift-title\">\n        <div class=\"col\">\n            <p class=\"shift-header\">requested by</p>\n            <p class=\"shift-name\">{{shift.name}}</p>\n        </div>\n        <div>\n            <p class=\"shift-header\">shift date</p>\n            <p class=\"shift-date\">\n                {{shift.startsAt.getTime() | date:\'mediumDate\'}}\n            </p>\n            <p class=\"shift-earnings\">Earnest Est: <span class=\"light-green\">{{(shift.endsAt.getTime() - shift.startsAt.getTime())/3600000 * hourlyRate | currency:undefined:0}}</span></p>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"col box-outline img-box\">\n            <img ng-src=\"./img/companies/{{shift.company}}.png\" alt=\"\">\n            <p>{{shift.company | capitalize}}</p>\n        </div>\n        <div class=\"col box-outline time-box\">\n            <p>from</p>\n            <h4>\n                <standard-time-meridian etime=\'shift.startsAt.getHours()*3600\'></standard-time-meridian>\n            </h4>\n            <p>to</p>\n            <h4>\n            <standard-time-meridian etime=\'shift.endsAt.getHours()*3600\'></standard-time-meridian>\n            </h4>\n        </div>\n        <div class=\"col box-outline\">\n            <button ng-click=\"accept(shift)\" class=\"button button-small button-positive\">\n                Accept\n            </button>\n            <button class=\"button button-small button-stable\">\n                Decline\n            </button>\n        </div>\n    </div>\n</div>\n<color-divider/>");
$templateCache.put("templates/shared/targetControls.html","<div class=\"weeklyTarget\">\n	<p class= \"weekly-hours light-blue\">{{currentUser.hourlyTarget}}</p>\n	<div class=\"item range\">\n		0\n		<input type=\"range\" ng-model=\"currentUser.hourlyTarget\" name=\"hours\" ng-change=\"update(currentUser.hourlyTarget)\" min=\"0\" max=\"80\">\n		80\n	</div>\n	<p class=\"small-light\">Earnings estimate</p>\n\n	<p class= \"currency-estimate light-green\">{{currentUser.hourlyTarget * hourlyRate | currency:undefined:0}}</p>\n</div>");
$templateCache.put("templates/shared/wg-pager.html","<div class=\"wg-pager\">\n    <span ng-repeat=\"(id, item) in labels\" ng-class=\"currentPage == id ? \'wg-pager-selected\' : \'\'\">\n      <span class=\"wg-circle\">\n        {{id + 1}}\n        <a class=\"wg-pager-label\">\n          {{item}}\n        </a>\n      </span>\n      <span ng-hide=\"$last\" class=\"wg-dash\">\n   \n      </span>\n    </span>    \n</div>");
$templateCache.put("templates/shared/wg-profile-photo.html","<div class=\"wg-profile-wrapper\">\n	<div class=\"wg-profile-photo\"ng-click=\"changePhoto()\" ng-style=\"{\'background-image\':\'url(\'+imageURL+\')\'}\"></div>\n</div>");}]);