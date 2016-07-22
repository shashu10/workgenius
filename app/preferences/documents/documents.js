class DocumentsPreferenceCtrl {

    constructor(public currentUser:CurrentUserService) {

        this.actionButtons = [{ text: 'Camera' }, { text: 'Photo Library' }]
        if (ionic.Platform.isAndroid())
            this.actionButtons = [{ text: '<i class="icon ion-camera"></i> Camera' }, { text: '<i class="icon ion-ios-albums"></i> Photo Library' }]
    }

    public canContinue = false
    private actionButtons

    displayImage(imageURI) {
        if (imageURI) {
            this.canContinue = true
        }
    }
    showPictureOptions() {
        this.$ionicActionSheet.show({
            titleText: 'Add a recent picture of yourself with your head and shoulders in view',
            buttons: this.actionButtons,
            cancelText: 'Cancel',
            cancel: () => {
                console.log('CANCELLED')
            },
            buttonClicked: (index) => {
                if (index === 0)
                    this.wgImage.takeHeadshotPicture(Camera.PictureSourceType.CAMERA, this.displayImage)
                else
                    this.wgImage.takeHeadshotPicture(Camera.PictureSourceType.PHOTOLIBRARY, this.displayImage)

                console.log('BUTTON CLICKED', index)
                return true
            }
        })
    }
    next() {
        this.ApplicationStates.next()
    }
}

CarDocumentsCtrl.$inject = ["ApplicationStates", "$ionicActionSheet", "wgImage"]
