enum UploadType {
    headshot    = <any> "workgenius-headshots",
    document = <any> "workgenius-documents",
}

enum DocumentUploadType {
    headshot = <any>"headshot",
    registration = <any>"registration",
    insurance = <any>"insurance",
    license = <any>"license"
}

class WGImage {

    constructor(public currentUser: CurrentUserService,
                public $cordovaFileTransfer: ngCordova.IFileTransferService,
                public $cordovaCamera: ngCordova.ICameraService,
                public $rootScope: angular.IRootScopeService) {}

    public takeHeadshotPicture(source: number, callback: Function) {this.takePicture(source, Camera.Direction.FRONT, callback, UploadType.headshot)}
    public takeDocumentPicture(source: number, doc: WGDocument, callback: Function) {this.takePicture(source, Camera.Direction.BACK , callback, UploadType.document, doc)}

    private takePicture(source: number, direction: number, callback: Function, uploadType: UploadType, document?: WGDocument): PromiseLike<any> {
        // localhost testing
        if (!Camera) {
            callback("img/profile-placeholder.png")
            console.error("Camera plugin is not installed")
        }

        return this.$cordovaCamera.getPicture({
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: source,
            // allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 700,
            targetHeight: 800,
            cameraDirection : direction,
            // popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true

        }).then((fileURI) => {
            callback(fileURI)
            console.log(fileURI)

            return this.uploadImage(fileURI, uploadType, document) as PromiseLike<any>

        }, (err) => {
            callback()
            console.log(err)
            console.error("Could not take picture")

            return Parse.Promise.error('') as PromiseLike<any>
        })
    }
    private uploadImage(fileURI: string, uploadType: UploadType, document?: WGDocument) {
        if (document) {
            document.imageURI = fileURI
            document.uploading = true
        }

        let filename = this.generateFilename(uploadType, document)

        return this.getSignature(filename, uploadType.toString())
        .then((result) => {

            console.log("Success getting signature")
            console.log(result)

            return this.uploadImageToS3(filename, fileURI, result)
        })
        .then((result) => {

            if (document)
                document.imageURI = fileURI

            console.log("success uploading")
            console.log(result)

            return this.saveInParse(filename, document)
        })
        .then(() => {
            if (document) {
                document.uploading = false
                document.uploaded = true
            }
            console.log("success updating headshot in parse")
            this.$rootScope.$apply()

        }, (error) => {
            if (document) document.error = true

            console.log('Something went wrong');
            console.log(error);
            this.$rootScope.$apply()
        })
    }
    private generateFilename(uploadType: UploadType, document?: WGDocument) {
        if (!Parse.User.current())
            return "test.jpeg"
        else if (uploadType === UploadType.headshot)
            return this.currentUser.lodashCaseName + "-" + this.currentUser.id + (new Date()).getTime() + ".jpeg"
        else
            return this.currentUser.lodashCaseName + "-" + document + "-" + this.currentUser.id + "-" + (new Date()).getTime() + ".jpeg"
    }
    private saveInParse(filename: string, document?: WGDocument) {
        const prop = (document && document.type) || 'headshot'
        this.currentUser[prop] = `https://s3.amazonaws.com/${UploadType.headshot}/${filename}`
        return this.currentUser.save()
    }
    private uploadImageToS3(filename: string, fileURI: string, s3Signature): ngCordova.IFileTransferPromise<any> {

        const options = {
            params: {
                "key": filename,
                "AWSAccessKeyId": s3Signature.awsKey,
                "acl": "public-read",
                "policy": s3Signature.policy,
                "signature": s3Signature.signature
            }
        }

        return this.$cordovaFileTransfer.upload(`https://${s3Signature.bucket}.s3.amazonaws.com/`, fileURI, options)
    }
    private getSignature(filename: string, bucket: string): Parse.Promise<any> {
        return Parse.Cloud.run('getS3Signature', {
            filename: filename,
            bucket: bucket
        });
    }
}

WGImage.$inject = ["currentUser", "$cordovaFileTransfer", "$cordovaCamera", "$rootScope"]
