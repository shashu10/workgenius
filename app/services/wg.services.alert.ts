enum AlertColor {
    success = <any> "#33cd5f",
    failure = <any> "#ef473a",
    warning = <any> "#ffc900",
}
class AlertDialogService {

    private _alertElement: ng.IAugmentedJQuery
    private _closeTimer: angular.IPromise<any>
    private _alertDuration = 2000 // ms

    constructor(public $interval: angular.IIntervalService) {
        this._alertElement = angular.element('<div class="shimmer"></div>');
        this._alertElement.css({
            position: 'absolute',
            transition: 'top .2s ease-out, background .2s',
            top: '-54px',
            left: '0px',
            height: '74px',
            textAlign: 'center',
            color: 'white',
            fontSize: '21px',
            lineHeight: '91px',
            width: '100%',
            zIndex: '9999',
        })
        const body = angular.element(document).find('body').eq(0);

        body.append(this._alertElement)
    }
    alert(color: AlertColor, text: string) {
        this.resetCloseTimer()

        this._alertElement.text(text)
        this._alertElement.css({
          top: '0px',
          background: color,
        })
    }
    resetCloseTimer() {
        if (this._closeTimer) this.$interval.cancel(this._closeTimer)

        this._closeTimer = this.$interval(() => {
            console.log("close")
            this._alertElement.css({
                top: '-54px',
                background: 'transparent',
            })
            this._closeTimer = undefined
        }, this._alertDuration, 1)
    }
}
AlertDialogService.$inject = ['$interval']