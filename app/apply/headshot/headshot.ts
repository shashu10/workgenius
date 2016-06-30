class HeadshotCtrl {

    constructor(public ApplicationStates: ApplicationStatesService,
                public $cordovaCamera: ngCordova.ICameraService,
                public $ionicActionSheet: ionic.actionSheet.IonicActionSheetService) {

        if (ionic.Platform.isAndroid()) {
            this.actionButtons = [{ text: '<i class="icon ion-camera"></i> Camera' },
                                  { text: '<i class="icon ion-ios-albums"></i> Photo Library' }]
        } else {
            this.actionButtons = [{ text: 'Camera' },
                                  { text: 'Photo Library' }]
        }
    }

    public imageData: string = "img/profile-placeholder.png"
    private actionButtons

    takePicture(source: number) {

        if (!Camera) return console.error("Camera plugin is not installed")

        this.$cordovaCamera.getPicture({
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: source,
            allowEdit: true,
            encodingType: Camera.EncodingType.PNG,
            targetWidth: 100,
            targetHeight: 100,
            cameraDirection : Camera.Direction.FRONT,
            // popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation:true

        }).then((imageData) => {

            console.log(imageData)
            // var image = document.getElementById('myImage');
            this.imageData = imageData;

            var base64 = "V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=";
            var file = new Parse.File("myfile.txt", { base64: base64 });

        }, (err) => {
            console.error("Could not take picture")
        });

    }

    showPictureOptions() {
        this.$ionicActionSheet.show({
            titleText: 'Add a recent picture of yourself with your head and shoulders in view',
            buttons: this.actionButtons,
            cancelText: 'Cancel',
            cancel: function() {
                console.log('CANCELLED');
            },
            buttonClicked: (index) => {
                if (index === 0)
                    this.takePicture(Camera.PictureSourceType.CAMERA)
                else
                    this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY)

                console.log('BUTTON CLICKED', index);
                return true;
            }
        });
    }
    next() {
        this.ApplicationStates.next()
    }
}

HeadshotCtrl.$inject = ["ApplicationStates", "$cordovaCamera", "$ionicActionSheet"]
