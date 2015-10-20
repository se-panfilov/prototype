'use strict';

angular.module('app.messages', ['toaster'])

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
                title = title || null;

                toaster.pop(_messageTypes.success, title, message);
            },
            showErrorMsg: function (message, title) {
                title = title || _messagesTitles.error;

                toaster.pop(_messageTypes.error, title, message);
            }
        };

    })
;