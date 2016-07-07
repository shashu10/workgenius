class WGImage {

    constructor(public currentUser: CurrentUserService, public $cordovaFileTransfer: ngCordova.IFileTransferService) {}

    public uploadHeadshot(fileURI: string) {this.uploadImage(fileURI, "workgenius-images")}
    public uploadDocument(fileURI: string) {this.uploadImage(fileURI, "workgenius-documents")}

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

WGImage.$inject = ["currentUser", "$cordovaFileTransfer"]
