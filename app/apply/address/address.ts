class AddressCtrl {

    public street: string
    public city: string
    public state: string
    public zip: number

    constructor(public ApplicationStates: ApplicationStatesService) {}

    next() {
        this.ApplicationStates.next({
            address: {
                street: this.street,
                city: this.city,
                state: this.state,
                zip: this.zip,
            }
        })
    }
}

AddressCtrl.$inject = ["ApplicationStates"]