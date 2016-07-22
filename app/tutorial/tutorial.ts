class WGIntroCtrl {
    constructor(public $state: angular.ui.IStateService) {}

    startApp()  {
        this.$state.go("welcome");
    }
    login() {
        // Easier to do this and store login credentials in currentuser
        // even though parse.login needs credientials passed in directly
        this.$state.go('login-email')
    }
    signup() {
        this.$state.go('signup-name')
    }
}

WGIntroCtrl.$inject = ["$state"];

class TutorialCard implements ng.IDirective {

    static instance(): ng.IDirective {
        return new TutorialCard()
    }

    templateUrl = 'tutorial/tutorial-card.html'
    restrict = 'E'
    scope = {
        title: '@',
        image: '@'
    }
}

angular.module('wg.tutorial', [])

.controller('TutorialCtrl', WGIntroCtrl)

.directive('tutorialCard', TutorialCard.instance)