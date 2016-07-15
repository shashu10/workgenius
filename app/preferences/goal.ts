class GoalPreferencesCtrl {

    public debouncedSave: any
    public onChange: Function

    constructor(public currentUser: CurrentUserService, public debounce: any, public alertDialog: AlertDialogService) {
        this.onChange = this.debounce.create(() => this.save());
    }

    save() {
        this.currentUser.save()
        .then(() => {
            this.alertDialog.alert(AlertColor.success, 'Saved!')
            console.log("success")
        }, () => {
            this.alertDialog.alert(AlertColor.failure, 'Could not save :(')
            console.log("failure")
        })
    }
}

GoalPreferencesCtrl.$inject = ["currentUser", "debounce", "alertDialog"]