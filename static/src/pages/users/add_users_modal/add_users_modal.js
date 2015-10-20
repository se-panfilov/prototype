'use strict';

angular.module('app.pages.users.modals.add_user', [])
    .controller('AddUsersPageCtrl', function ($modalInstance, $scope, UserFactory, MessagesFactory) {

        //Just a var for text messages
        var _messages = {
            userSuccessfulAddedMsg: 'User successful added',
            userAddFailedMsg: 'User add failed'
        };

        //Our model
        $scope.user = {};

        //Methods which can be access from html
        $scope.actions = {
            cancel: function () {
                $modalInstance.dismiss('cancel');
            },
            add: function () {
                //Call method from factory
                return UserFactory.addUser(function () {
                    //On success message
                    MessagesFactory.showSuccessMsg(_messages.userSuccessfulAddedMsg);
                    $modalInstance.close();
                }, function () {
                    //On error message
                    MessagesFactory.showErrorMsg(_messages.userAddFailedMsg);
                    $modalInstance.close();
                });
            }
        };

    })
;