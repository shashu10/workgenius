class PersonalInfoPageCtrl {

    public debouncedSave: Function

    constructor(public currentUser: CurrentUserService,
                public wgDebounce: WGDebounce,
                public alertDialog: AlertDialogService,
                public wgState: WGState) {
        this.debouncedSave = this.wgDebounce.create(() => this.save(), 1000);
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

    logout() {
        this.currentUser.logOut()
        this.wgState.goWithoutAnimate('tutorial')
        this.wgState.clearCache()
    }
}

PersonalInfoPageCtrl.$inject = ["currentUser", "wgDebounce", "alertDialog", "wgState"]