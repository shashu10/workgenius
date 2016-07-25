class Document {
    static type
}

// Don't cache view. It needs to refresh docs required on every load
class DocumentsCtrl {

    public list: string[]

    constructor(public ApplicationStates: ApplicationStatesService,
                public $ionicActionSheet: ionic.actionSheet.IonicActionSheetService,
                public wgImage: WGImage) {

        this.actionButtons = [{ text: 'Camera' }, { text: 'Photo Library' }]
        if (ionic.Platform.isAndroid())
            this.actionButtons = [{ text: '<i class="icon ion-camera"></i> Camera' }, { text: '<i class="icon ion-ios-albums"></i> Photo Library' }]
        this.list = this.ApplicationStates.getRequiredDocs()
    }

    public imageData: string
    public canContinue = false
    private error = false
    private actionButtons

    longName(docName: string) {
        switch (docName) {
            case "license": return "Driver's License";
            case "insurance": return "Proof of Insurance";
            case "registration": return "Vehicle Registration";
            default: return docName;
        }
    }

    showPictureOptions(docName) {
        this.$ionicActionSheet.show({
            titleText: `Add a valid picture of your ${this.longName(docName)}`,
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

DocumentsCtrl.$inject = ["ApplicationStates", "$ionicActionSheet", "wgImage"]
