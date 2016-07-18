/// <reference path="./wg.services.alert.ts" />

angular.module('wg.services', [])

.service('alertDialog', AlertDialogService)

.service('keyboardManager', KeyboardManagerService)

.service('wgDebounce', WGDebounce)

