class HeadshotCtrl {

    constructor(public ApplicationStates: ApplicationStatesService,
                public $ionicActionSheet: ionic.actionSheet.IonicActionSheetService,
                public wgImage: WGImage,
                public currentUser: CurrentUserService) {

        if (IS_TESTING) this.canContinue = true
        else this.canContinue = false

        this.actionButtons = [{ text: 'Camera' }, { text: 'Photo Library' }]
        if (ionic.Platform.isAndroid())
            this.actionButtons = [{ text: '<i class="icon ion-camera"></i> Camera' }, { text: '<i class="icon ion-ios-albums"></i> Photo Library' }]
        this.imageData = this.currentUser.headshot || "img/profile-placeholder.png"
    }

    public canContinue: boolean
    public imageData: string
    private actionButtons
    private error = false

    showPictureOptions() {
        this.$ionicActionSheet.show({
            titleText: 'Add a recent picture of yourself with your head and shoulders in view',
            buttons: this.actionButtons,
            cancelText: 'Cancel',
            cancel: () => {
                console.log('CANCELLED')
            },
            buttonClicked: (index) => {
                let option = Camera.PictureSourceType.PHOTOLIBRARY
                if (index === 0) option = Camera.PictureSourceType.CAMERA
                this.wgImage.takeHeadshotPicture(option, (imageURI) => {
                    if (!imageURI) {
                        this.error = true
                        return
                    }
                    this.imageData = imageURI
                    this.canContinue = true
                })

                console.log('BUTTON CLICKED', index)
                return true
            }
        })
    }
    next() {
        this.ApplicationStates.next()
    }
}

HeadshotCtrl.$inject = ["ApplicationStates", "$ionicActionSheet", "wgImage", "currentUser"]
