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

    constructor(public currentUser: CurrentUserService, public $cordovaFileTransfer: ngCordova.IFileTransferService, public $cordovaCamera: ngCordova.ICameraService) {}

    public takeHeadshotPicture(source: number, callback: Function) {this.takePicture(source, Camera.Direction.FRONT, callback, UploadType.headshot)}
    public takeDocumentPicture(source: number, type: DocumentUploadType, callback: Function) {this.takePicture(source, Camera.Direction.BACK , callback, UploadType.document, type)}

    private takePicture(source: number, direction: number, callback: Function, uploadType: UploadType, documentType?: DocumentUploadType) {
        // localhost testing
        if (!Camera) {
            callback("img/profile-placeholder.png")
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
            cameraDirection : direction,
            // popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true

        }).then((fileURI) => {
            callback(fileURI)
            console.log(fileURI)
            this.uploadImage(fileURI, uploadType)

        }, (err) => {
            callback()
            console.log(err)
            console.error("Could not take picture")
        })
    }
    private uploadImage(fileURI: string, uploadType: UploadType, documentType?: DocumentUploadType) {

        let filename = this.generateFilename(uploadType)

        return this.getSignature(filename, uploadType.toString())
        .then((result) => {
            console.log("Success getting signature")
            console.log(result)

            return this.uploadImageToS3(filename, fileURI, result)
        })
        .then((result) => {
            console.log("success uploading")
            console.log(result)

            return this.saveInParse(filename)
        })
        .then(() => {
            console.log("success updating headshot in parse")

        }, (error) => {
            console.log('Something went wrong');
            console.log(error);
        })
    }
    private generateFilename(uploadType: UploadType, documentType?: DocumentUploadType) {
        if (!Parse.User.current())
            return "test.jpeg"
        else if (uploadType === UploadType.headshot)
            return this.currentUser.camelCaseName + "-" + this.currentUser.id + (new Date()).getTime() + ".jpeg"
        else
            return this.currentUser.camelCaseName + "-" + documentType + this.currentUser.id + (new Date()).getTime() + ".jpeg"
    }
    private saveInParse(filename: string) {
        return this.currentUser.save({
            headshot: `https://s3.amazonaws.com/${UploadType.headshot}/${filename}`
        })
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

WGImage.$inject = ["currentUser", "$cordovaFileTransfer", "$cordovaCamera"]
