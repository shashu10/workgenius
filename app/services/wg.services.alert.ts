enum AlertColor {
    success = <any> "#33cd5f",
    failure = <any> "#ef473a",
    warning = <any> "#ffc900",
}
class AlertDialogService {

    private _alertElement: ng.IAugmentedJQuery
    private _closeTimer: angular.IPromise<any>
    private _alertDuration = 2000 // ms
    private isAndroid = ionic.Platform.isAndroid();
    private showParams: Function
    private hideParams: any

    constructor(public $interval: angular.IIntervalService) {
        this._alertElement = angular.element('<div class="shimmer"></div>');

        // Initializing params for iOS popping from up and android poppping from below
        let cssOptions: any = {
            position: 'absolute',
            transition: 'top .2s ease-out, background .2s',
            top: '-74px',
            left: '0px',
            height: '74px',
            textAlign: 'center',
            color: 'white',
            fontSize: '21px',
            lineHeight: '91px',
            width: '100%',
            zIndex: '9000',
        }
        this.showParams = (color) => {
          return {
              top: '0px',
              background: color,
          }
        }
        this.hideParams = {
            top: '-74px',
            background: 'transparent',
        }
        if (this.isAndroid) {
            cssOptions.transition = 'bottom .2s ease-out, background .2s'
            delete cssOptions.top
            cssOptions.bottom = '-54px'
            cssOptions.height = '54px'
            cssOptions.lineHeight = '54px'
            this.showParams = (color) => {
              return {
                  bottom: '0px',
                  background: color,
              }
            }
            this.hideParams = {
                bottom: '-54px',
                background: 'transparent',
            }
        }

        this._alertElement.css(cssOptions)
        const body = angular.element(document).find('body').eq(0);

        body.append(this._alertElement)
    }
    alert(color: AlertColor, text: string) {
        this.resetCloseTimer()

        this._alertElement.text(text)
        this._alertElement.css(this.showParams(color))
    }
    resetCloseTimer() {
        if (this._closeTimer) this.$interval.cancel(this._closeTimer)

        this._closeTimer = this.$interval(() => {
            console.log("close")
            this._alertElement.css(this.hideParams)
            this._closeTimer = undefined
        }, this._alertDuration, 1)
    }
}
AlertDialogService.$inject = ['$interval']