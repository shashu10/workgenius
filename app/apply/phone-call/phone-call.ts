class PhoneCallCtrl {

    public timeslots: any
    public choice: any
    public moreSlots = false

    constructor(public ApplicationStates: ApplicationStatesService,
                public currentUser: CurrentUserService,
                public $http: angular.IHttpService,
                public $ionicScrollDelegate: ionic.scroll.IonicScrollDelegate) {

        this.getAllTimeslots()
    }
    // wgscheduler-env.us-east-1.elasticbeanstalk.com
    getAllTimeslots() {
        this.$http.get('http://wgscheduler-env.us-east-1.elasticbeanstalk.com/getAvailabilities')

        .then((result: TimeSlotData) => {
            _.forEach(result.data, (slot) => {slot.start = moment(slot.start).format('dddd Do h:mm a')})
            this.timeslots = result.data
            this.resize()
        }, (err) => {
            console.log(err)
        })
    }
    signupTimeslot() {
        this.$http.post('http://wgscheduler-env.us-east-1.elasticbeanstalk.com/updateEvent', {
            "email": this.currentUser.email,
            "name": this.currentUser.name,
            "eventId": this.choice.id
        })
        .then((result) => {
            console.log(result)
            console.log("Success")

        }, (err) => {
            console.log(err)
        })
    }
    next() {
        this.signupTimeslot()
        this.ApplicationStates.next()
    }
    resize() {
        this.$ionicScrollDelegate.resize()
    }
}

interface TimeSlotData {
    data: any[]
}
PhoneCallCtrl.$inject = ["ApplicationStates", "currentUser", "$http", "$ionicScrollDelegate"]