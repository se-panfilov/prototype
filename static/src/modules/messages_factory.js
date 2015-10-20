'use strict';

//Define module with third-party licence
angular.module('app.messages', ['toaster'])

    //Factory just show success or errors messages for the user
    .factory('MessagesFactory', function (toaster) {

        var _messageTypes = {
            success: 'success',
            error: 'error'
        };

        var _messagesTitles = {
            error: 'Error'
        };

        return {
            showSuccessMsg: function (message, title) {
                toaster.pop(_messageTypes.success, title, message);
            },
            showErrorMsg: function (message, title) {
                title = title || _messagesTitles.error;
                toaster.pop(_messageTypes.error, title, message);
            }
        };

    })
;