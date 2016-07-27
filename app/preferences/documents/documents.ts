// Don't cache view. It needs to refresh docs required on every load
class DocumentsPreferenceCtrl {

    public list: WGDocument[] = []

    constructor(public currentUser: CurrentUserService,
                public $ionicActionSheet: ionic.actionSheet.IonicActionSheetService,
                public wgImage: WGImage) {

        this.actionButtons = [{ text: 'Camera' }, { text: 'Photo Library' }]
        if (ionic.Platform.isAndroid())
            this.actionButtons = [{ text: '<i class="icon ion-camera"></i> Camera' }, { text: '<i class="icon ion-ios-albums"></i> Photo Library' }]

        // Setup currentUser documents
        let license = new WGDocument(DocumentUploadType.license)
        if (!currentUser.license) license.uploaded = true
        this.list.push(license)
        let registration = new WGDocument(DocumentUploadType.registration)
        if (!currentUser.registration) registration.uploaded = true
        this.list.push(registration)
        let insurance = new WGDocument(DocumentUploadType.insurance)
        if (!currentUser.insurance) insurance.uploaded = true
        this.list.push(insurance)
    }

    public imageData: string
    private actionButtons

    get canContinue(): boolean {
        return _.reduce(this.list, (result, doc, key) => (result && doc.uploaded), true);
    }

    get error(): boolean {
        if (!window['Camera']) return true
        return _.reduce(this.list, (result, doc, key) => (result && doc.error), true);
    }

    getClass(doc: WGDocument) {
        if (doc.error) return 'button-assertive'
        else if (doc.uploaded) return 'button-balanced'
        else return 'button-positive'
    }

    showPictureOptions(doc: WGDocument) {
        this.$ionicActionSheet.show({
            titleText: `Add a valid picture of your ${doc.longName}`,
            buttons: this.actionButtons,
            cancelText: 'Cancel',
            cancel: () => {
                console.log('CANCELLED')
            },
            buttonClicked: (index) => {
                if (!window['Camera']) {
                    doc.error = true
                    return true
                }
                let option = Camera.PictureSourceType.PHOTOLIBRARY
                if (index === 0) option = Camera.PictureSourceType.CAMERA
                this.wgImage.takeDocumentPicture(option, doc, (imageURI) => {
                    if (!imageURI) {
                        return
                    }
                    this.imageData = imageURI
                    // this.canContinue = true
                })

                console.log('BUTTON CLICKED', index)
                return true
            }
        })
    }
}

DocumentsPreferenceCtrl.$inject = ["currentUser", "$ionicActionSheet", "wgImage"]
