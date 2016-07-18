class KeyboardManagerService {

    public isVisible = false

    constructor(public $interval: angular.IIntervalService) {
        // This event fires when the keyboard will be shown
        window.addEventListener('native.keyboardshow', (e: any) => this.isVisible = true);
        // This event fires when the keyboard will hide
        window.addEventListener('native.keyboardhide', (e: any) => this.isVisible = false);
    }
}
KeyboardManagerService.$inject = ['$interval']