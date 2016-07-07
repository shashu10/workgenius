class WGImage {

    constructor(public currentUser: CurrentUserService, public $cordovaFileTransfer: ngCordova.IFileTransferService, public $cordovaCamera: ngCordova.ICameraService) {}

    public uploadHeadshot(fileURI: string) {this.uploadImage(fileURI, "workgenius-images")}
    public uploadDocument(fileURI: string) {this.uploadImage(fileURI, "workgenius-documents")}

    public takeHeadshotPicture(source: number, callback: Function) {this.takePicture(source, Camera.Direction.FRONT, callback, this.uploadHeadshot)}
    public takeDocumentPicture(source: number, callback: Function) {this.takePicture(source, Camera.Direction.BACK , callback, this.uploadDocument)}

    private takePicture(source: number, direction: number, callback: Function, uploader: Function) {
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
            uploader(fileURI)

        }, (err) => {
            callback()
            console.log(err)
            console.error("Could not take picture")
        })
    }
    private uploadImage(fileURI: string, bucket: string) {

        return this.getSignature(bucket)
        .then((result) => {
            console.log("Success getting signature")
            console.log(result)

            return this.uploadImageToS3(fileURI, result)
        })
        .then((result) => {
            console.log("success uploading")
            console.log(result.location)
        }, (error) => {
            console.log('Failed');
            console.log(error);
        })
    }
    private uploadImageToS3(fileURI: string, s3Signature): ngCordova.IFileTransferPromise<any> {

        var options = {
            params: {
                "key": "test.jpeg",
                "AWSAccessKeyId": s3Signature.awsKey,
                "acl": "bucket-owner-full-control",
                "policy": s3Signature.policy,
                "signature": s3Signature.signature
            }
        }

        return this.$cordovaFileTransfer.upload("https://" + s3Signature.bucket + ".s3.amazonaws.com/", fileURI, options)
    }
    private getSignature(bucket: string): Parse.Promise<any> {
        return Parse.Cloud.run('getS3Signature', {
            filename: "test.jpeg",
            bucket: bucket
        });
    }
}

WGImage.$inject = ["currentUser", "$cordovaFileTransfer", "$cordovaCamera"]
