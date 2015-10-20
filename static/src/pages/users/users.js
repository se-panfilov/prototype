'use strict';

//Define module
angular.module('app.pages.users', [
    //Define module deps
    //Both modals and ui-router for the routing
    'app.pages.users.modals.add_user',
    'app.pages.users.modals.remove_user',
    'ui.router'
])

    //Routes config
    //Each module has own routes config (we can easily remove module from the project)
    .config(function ($stateProvider) {

        $stateProvider
            //Base route, which be like a parent for the modals
            .state('users', {
                url: '/users',
                templateUrl: 'users/users.html',
                controller: 'UsersPageCtrl'//,//TODO (S.Panfilov) fix inject UserFactory
                //resolve: {
                //    usersList: function () {
                //        return UserFactory.getUsersList();
                //    }
                //}
            })

            //Child routes (this one - for "add" modal
            //the route will be parent + child = /users/add
            .state('users.add', {
                url: '/add',
                //We open the modal on enter
                onEnter: function ($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'users/add_users_modal/add_users_modal.html',
                        controller: 'AddUsersPageCtrl'
                    }).result.finally(function () {
                            //After modal will be closed, we go up to one level (to the '/users')
                            $state.go('^');
                        });
                }
            })

            //All the same for remove except here we can take "id" as url param
            .state('users.remove', {
                url: '/remove/:ids',
                onEnter: function ($stateParams, $state, $modal, UserFactory) {
                    var ids = $stateParams.ids;
                    $modal.open({
                        templateUrl: 'users/remove_users_modal/remove_users_modal.html',
                        controller: 'RemoveUserModalController',
                        resolve: {
                            //Modal will be waiting until all queries in resolve block finished.
                            //After that we can use "userData" promise in modal's controller
                            userData: function () {
                                return UserFactory.getUser(ids);
                            }
                        }
                    }).result.finally(function () {
                            $state.go('^');
                        });
                }
            })
        ;
    })

    //User page controller. Should be DRY.
    .controller('UsersPageCtrl', function ($scope, UserFactory, usersList, MessagesFactory) {


        //functions, which can be access from the html
        $scope.actions = {
            addUser: function () {

            },
            removeUser: function (id) {
                UserFactory.removeUser(id).then(function () {
                    //On success message
                    MessagesFactory.showSuccessMsg(_messages.userSuccessfulRemovedMsg);
                },function () {
                    //On error message
                    MessagesFactory.showErrorMsg(_messages.userRemoveFailedMsg);
                });
            }
        };

        //Called once on page load
        (function init() {
            //add usersList to scope (passed by reference), so now we can access usersList from html
            $scope.usersList = usersList;
        })();

    });