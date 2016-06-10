class CurrentUser {

    private _currentUser = Parse.User.current() || new Parse.User()

    constructor() {}

    create() {
        this._currentUser = new Parse.User();
    }

    get password(): string { return this._currentUser.get('password') }
    set password(password: string) { this._currentUser.set('password', password) }

    get name(): string { return this._currentUser.get('name') }
    set name(name: string) { this._currentUser.set('name', name) }

    get email(): string { return this._currentUser.get('email') }
    set email(email: string) { this._currentUser.set('email', email); this._currentUser.set('username', email) }

    logIn(): Parse.Promise<any> {
    	return Parse.User.logIn(this.email, this.password)
    }
    signUp(): Parse.Promise<any> {

        // Make them lowercase so we don't have people signing up twice
        this._currentUser.set('email', this.email.toLowerCase());
        this._currentUser.set('username', this.email.toLowerCase());

    	return this._currentUser.signUp()
    }
    resetPassword(): Parse.Promise<any> {
        return Parse.User.requestPasswordReset(this.email.toLowerCase())
    }
}

angular.module('wg.user', [])

.service('currentUser', CurrentUser)