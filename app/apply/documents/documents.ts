// Don't cache view. It needs to refresh docs required on every load
class DocumentsCtrl {

    public list: WGDocument[]

    constructor(public ApplicationStates: ApplicationStatesService,
                public $ionicActionSheet: ionic.actionSheet.IonicActionSheetService,
                public wgImage: WGImage) {

        this.actionButtons = [{ text: 'Camera' }, { text: 'Photo Library' }]
        if (ionic.Platform.isAndroid())
            this.actionButtons = [{ text: '<i class="icon ion-camera"></i> Camera' }, { text: '<i class="icon ion-ios-albums"></i> Photo Library' }]
        this.list = this.ApplicationStates.getRequiredDocs()
    }

    public imageData: string
    private actionButtons

    // Continue if you couldn't upload
    get canContinue(): boolean {
        return _.reduce(this.list, (result, doc, key) => (result && (doc.uploaded || doc.error)), true);
    }

    get error(): boolean {
        if (!window['Camera']) return true
        return _.reduce(this.list, (result, doc, key) => (result && doc.error), true);
    }

    get hasError(): boolean {
        if (!window['Camera']) return true
        return _.reduce(this.list, (result, doc, key) => (result || doc.error), false);
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
    next() {
        this.ApplicationStates.next()
    }
}

DocumentsCtrl.$inject = ["ApplicationStates", "$ionicActionSheet", "wgImage"]