declare var parsePluginInitialized: boolean

class HeadshotCtrl {

    private s3Signature

    constructor(public ApplicationStates: ApplicationStatesService,
                public $cordovaCamera: ngCordova.ICameraService,
                public $ionicActionSheet: ionic.actionSheet.IonicActionSheetService,
                public $cordovaFileTransfer: ngCordova.IFileTransferService,
                public wgImage: WGImage) {

        if (ionic.Platform.isAndroid()) {
            this.actionButtons = [{ text: '<i class="icon ion-camera"></i> Camera' },
                                  { text: '<i class="icon ion-ios-albums"></i> Photo Library' }]
        } else {
            this.actionButtons = [{ text: 'Camera' },
                                  { text: 'Photo Library' }]
        }
    }

    public canContinue = false
    public imageData: string = "img/profile-placeholder.png"
    private actionButtons

    takePicture(source: number) {

        // localhost testing
        if (!Camera) {
            this.next()
            return console.error("Camera plugin is not installed")
        }

        this.$cordovaCamera.getPicture({
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: source,
            // allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 700,
            targetHeight: 800,
            cameraDirection : Camera.Direction.FRONT,
            // popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true

        }).then((fileURI) => {
            this.canContinue = true
            this.imageData = fileURI
            console.log(fileURI)
            this.wgImage.uploadHeadshot(fileURI)

        }, (err) => {
            console.log(err)
            console.error("Could not take picture")
        })
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
                    this.takePicture(Camera.PictureSourceType.CAMERA)
                else
                    this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY)

                console.log('BUTTON CLICKED', index)
                return true
            }
        })
    }
    next() {
        this.ApplicationStates.next()
    }
}

HeadshotCtrl.$inject = ["ApplicationStates", "$cordovaCamera", "$ionicActionSheet", "$cordovaFileTransfer", "wgImage"]
