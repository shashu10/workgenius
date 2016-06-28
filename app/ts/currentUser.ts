class CurrentUserService {

    public obj: Parse.User

    // User for availability questionaire but not saved to parse
    public availabilityDays: Object[];
    public availabilityTimes: Object[];

    constructor() {}

    init() {
        this.obj = Parse.User.current()
    }
    create() {
        this.obj = new Parse.User();
    }

    get password(): string { return this.obj && this.obj.get('password') }
    set password(password: string) { this.obj && this.obj.set('password', password) }

    get firstName(): string { return (this.obj && this.obj.get('name') || "").split(" ")[0] }
    get name(): string { return this.obj && this.obj.get('name') }
    set name(name: string) { this.obj && this.obj.set('name', name) }

    get email(): string { return this.obj && this.obj.get('email') }
    set email(email: string) { this.obj && this.obj.set('email', email); this.obj && this.obj.set('username', email) }

    get hoursGoal(): number { return Math.round(this.earningsGoal / 18) }
    get earningsGoal(): number { return this.obj && this.obj.get('earningsGoal') || 140 }
    set earningsGoal(earningsGoal: number) { this.obj && this.obj.set('earningsGoal', earningsGoal) }

    get phone(): string { return this.obj && this.obj.get('phone') }
    set phone(phone: string) { this.obj && this.obj.set('phone', phone) }

    hasCar() {
        return true
    }

    save(params?: Object) {
        // Testing env may not have current user
        if (Parse.User.current()) {

            console.log(this.obj.get('locations'))
            return Parse.User.current()
                .save(params)
                .then(() => {
                    console.log("saved")
                }, (err) => {
                    console.log("error")
                    console.log(err)
                })
        }
        else
            return Parse.Promise.as(this.obj)
    }

    logIn(): Parse.Promise<any> {
    	return Parse.User.logIn(this.email, this.password)
    }

    signUp(): Parse.Promise<any> {

        // Make them lowercase so we don't have people signing up twice
        this.obj.set('email', this.email.toLowerCase());
        this.obj.set('username', this.email.toLowerCase());

    	return this.obj.signUp()
    }
    resetPassword(): Parse.Promise<any> {
        return Parse.User.requestPasswordReset(this.email.toLowerCase())
    }
}

angular.module('wg.user', [])

.service('currentUser', CurrentUserService)