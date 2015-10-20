'use strict';

angular.module('app.pages.users.modals.remove_user', [])
    .controller('RemoveUserModalController', function ($scope, $modalInstance, UserFactory, $stateParams, userData, MessagesFactory) {

        //Just a var for text messages
        var _messages = {
            userSuccessfulRemovedMsg: 'User successful removed',
            userRemoveFailedMsg: 'User remove fails'
        };

        $scope.selectedUser = {};

        $scope.actions = {
            cancel: function () {
                $modalInstance.dismiss('cancel');
            },
            remove: function () {
                var usersIds = $stateParams.id;

                return UserFactory.removeUsers(usersIds).then(function () {
                    //On success message
                    MessagesFactory.showSuccessMsg(_messages.userRemoveFailedMsg);
                    $modalInstance.close();
                }, function () {
                    //On error message
                    MessagesFactory.showErrorMsg(_messages.userRemoveFailedMsg);
                    $modalInstance.close();
                });
            }
        };

        (function _init() {
            $scope.selectedUser = userData.results[0];
        })();

    })
;