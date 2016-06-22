class CurrentUser {

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

    get password(): string { return this.obj.get('password') }
    set password(password: string) { this.obj.set('password', password) }

    get firstName(): string { return (this.obj.get('name') || "").split(" ")[0] }
    get name(): string { return this.obj.get('name') }
    set name(name: string) { this.obj.set('name', name) }

    get email(): string { return this.obj.get('email') }
    set email(email: string) { this.obj.set('email', email); this.obj.set('username', email) }

    get goal(): number { return this.obj.get('goal') || 100 }
    set goal(goal: number) { this.obj.set('goal', goal) }

    get locations(): string[] { return this.obj.get('locations') }
    set locations(locations: string[]) { this.obj.set('locations', locations) }

    get phone(): string { return this.obj.get('phone') }
    set phone(phone: string) { this.obj.set('phone', phone) }

    hasCar() {
        return true
    }

    save() {
        if (Parse.User.current()) // Testing env may not have current user
            return this.obj.save()
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

.service('currentUser', CurrentUser)