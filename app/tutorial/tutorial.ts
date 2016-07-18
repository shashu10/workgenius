class WGIntroCtrl {
	constructor(public $state:angular.ui.IStateService) {}

	startApp()  {
		this.$state.go("welcome");
	}
	next() {}
}

WGIntroCtrl.$inject = ["$state"];

angular.module('wg.tutorial',[])

.controller('TutorialCtrl', WGIntroCtrl);
