class DocumentsPreferenceCtrl {

    constructor(public currentUser: CurrentUserService,
                public wgImage: WGImage,
                public $ionicActionSheet: ionic.actionSheet.IonicActionSheetService,
                public wgDebounce: WGDebounce,
                public alertDialog: AlertDialogService) {

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

        this.save()

    }
    showPictureOptions(type) {
        this.$ionicActionSheet.show({
            titleText: 'Upload a clear picture of your document',
            buttons: this.actionButtons,
            cancelText: 'Cancel',
            cancel: () => {
                console.log('CANCELLED')
            },
            buttonClicked: (index) => {
                let option = Camera.PictureSourceType.PHOTOLIBRARY
                if (index === 0) option = Camera.PictureSourceType.CAMERA
                this.wgImage.takeDocumentPicture(option, type, (imageURI) => {
                    if (imageURI) {
                        // this.alertDialog.alert(AlertColor.success,"Saved");
                    }
                    this.canContinue = true
                })

                console.log('BUTTON CLICKED', index)
                return true
            }
        })

    }
    save() {
    	// save something ehh
    }

}

DocumentsPreferenceCtrl.$inject = ["currentUser", "wgImage", "$ionicActionSheet", "wgDebounce", "alertDialog"];