class DocumentsPreferenceCtrl {

    constructor(public currentUser:CurrentUserService,public wgImage:WGImage,
    			public $ionicActionSheet:ionic.actionSheet.IonicActionSheetService,
    			public wgDebounce:WGDebounce,public alertDialog:AlertDialogService) {

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
        this.wgImage.uploadHeadshot(imageURI);

        
        this.save()

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
    save() {
    	//save something ehh
    }

}

DocumentsPreferenceCtrl.$inject = ["currentUser","wgImage","$ionicActionSheet","wgDebounce","alertDialog"];