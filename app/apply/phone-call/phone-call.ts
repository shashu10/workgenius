class PhoneCallCtrl {

    public timeslots: any
    public choice: any

    constructor(public ApplicationStates: ApplicationStatesService, public $http: angular.IHttpService) {

        this.getAllTimeslots()
    }
    getAllTimeslots() {
        this.$http.get('http://wgscheduler-env.us-east-1.elasticbeanstalk.com/getAvailabilities')

        .then((result: TimeSlotData) => {
            console.log(result)
            this.timeslots = _.map(result.data, (slot) => {
                slot.start = new Date(slot.start && slot.start.dateTime)
                return slot
            })
            console.log("Success")

        }, (err) => {
            console.log(err)
        });
    }
    next() {
        this.ApplicationStates.next()
    }
}

interface TimeSlotData {
    data: any[]
}
PhoneCallCtrl.$inject = ["ApplicationStates", "$http"]