class WizardStatesService {

    public progressbar
    private _states = [
        'wizard-goal',
        'wizard-locations',
        'wizard-availability-days',
        'wizard-availability-times',
        'wizard-vehicles',
        'app.companies',
    ]

    constructor(public $state: ng.ui.IStateService,
                public $rootScope: ng.IRootScopeService,
                public currentUser: CurrentUserService,
                public ngProgressFactory) {
        localStorage.setItem('wg.startedWizard', 'true');
        this.initProgressBar()
    }

    get nextPage(): string {
        return this._states[this.index + 1]
    }
    get index(): number {
        return this._states.indexOf(this.$state.current.name)
    }
    initProgressBar() {
        this.progressbar = this.ngProgressFactory.createInstance();
        this.progressbar.setColor('#09f');

        this.setProgress(this.index)

        var unregister = this.$rootScope.$on('$stateChangeSuccess', () => { 

            this.setProgress(this.index)
            if (this.hasFinished()) {
                localStorage.removeItem('wg.startedWizard');
                localStorage.setItem('wg.finishedWizard', 'true');
                this.progressbar.complete()
                unregister()
            }
        });
    }
    hasFinished() {
        return this.$state.current.name === this._states[this._states.length - 1]
    }
    setProgress(index: number) {
        this.progressbar.set((index + 1) / this._states.length * 100)
    }
    next(params?: Object) {
        this.currentUser.save(params)

        this.setProgress(this.index + 1)

        this.$state.go(this.nextPage)
    }
}

WizardStatesService.$inject = ["$state", "$rootScope", "currentUser", "ngProgressFactory"]
