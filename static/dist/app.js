'use strict';

//This is our main Angularjs module which bootstraping all others

angular.module('app', [
    //configs
    'app.config.url_map', //Our REST api routes constants

    //modules
    'app.header', //Header module
    'app.messages', //Messages module (to show user if query is ok or not)
    'app.templates', //!!!! This is where we keep all the html templates

    //pages
    'app.pages.users', //Our User page (with all the stuff like modals, directives, etc)
    'app.pages.other',

    //factories
    'app.user.factory', //User factory (encapsulate ajax queries, sockets, etc)

    //external libs
    'angular-loading-bar',
    'ngAnimate',
    'anim-in-out',
    'ui.router',
    'ngResource',
    'ui.bootstrap'
])

    //Here we keep constants of server responses
    .constant('HTTP_STATUS', {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        UNPROCESSABLE_ENTITY: 422,
        TOO_MANY_REQUESTS: 429,
        INTERNAL_SERVER_ERROR: 500,
        BAD_GATEWAY: 502
    })

    //Base app config
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
        //Our default route
        $urlRouterProvider.otherwise('/users');
        //Here we can intercept and process errors, like "unauthorized"
        //$httpProvider.interceptors.push('errorsInterceptors');
    }])
;

'use strict';

angular.module('app.messages', ['toaster'])

    .factory('MessagesFactory', ['toaster', function (toaster) {

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

    }])
;
angular.module("app.config.url_map", [])

.constant("urlMap", {
	"user": "/user/:id"
})

;
'use strict';

angular.module('app.user.factory', [])
    .factory('UserFactory', ['MessagesFactory', 'urlMap', '$resource', function (MessagesFactory, urlMap, $resource) {

        var _userApi = {
            user: $resource(urlMap['user'],
                {id: '@id'},
                {
                    get: {method: 'GET'},
                    add: {method: 'POST'},
                    remove: {method: 'DELETE'}
                }
            )
        };

        function getAllFromLocalStorage() {
            var users = [];
            var usersStr = localStorage.getItem('users');

            users = (usersStr && usersStr.length > 0) ? JSON.parse(usersStr) : users;

            return users;
        }

        function getFromLocalStorage(id) {
            var users = [];
            var usersStr = localStorage.getItem('users');
            var result;

            users = (usersStr && usersStr.length > 0) ? JSON.parse(usersStr) : users;

            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user.id === id) {
                    result = user;
                }
            }

            return result;
        }

        //Because there is no backend, e will use lockal storage
        return {
            getUsersList: function () {
                return getAllFromLocalStorage();

                //For example

                //return _userApi.user.get(function () {
                //    //
                //}, function (response) {
                //    //show some error
                //}).$promise;
            },
            getUser: function (id) {
                return getFromLocalStorage(id);

                //For example

                //return _userApi.user.get({id: id}, function () {
                //    //
                //}, function (response) {
                //    //show some error
                //}).$promise;
            },
            addUser: function () {

                //For example

                //return _userApi.user.add(function () {
                //    //
                //}, function (response) {
                //    //show some error
                //}).$promise;
            },
            removeUser: function (id) {

                //For example

                //return _userApi.user.remove({id: id}, function () {
                //    //
                //}, function (response) {
                //    //show some error
                //}).$promise;
            }
        };

    }])

;

'use strict';

angular.module('app.pages.other', [
    'ui.router'
])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('other', {
                url: '/other',
                templateUrl: 'other/other.html',
                controller: 'OtherPageCtrl'
            })
        ;
    }])

    .controller('OtherPageCtrl', function () {

    });
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
    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            //Base route, which be like a parent for the modals
            .state('users', {
                url: '/users',
                templateUrl: 'users/users.html',
                controller: 'UsersPageCtrl'
            })

            //Child routes (this one - for "add" modal
            //the route will be parent + child = /users/add
            .state('users.add', {
                url: '/add',
                //We open the modal on enter
                onEnter: ['$stateParams', '$state', '$modal', function ($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'users/add_users_modal/add_users_modal.html',
                        controller: 'AddUsersPageCtrl'
                    }).result.finally(function () {
                            //After modal will be closed, we go up to one level (to the '/users')
                            $state.go('^');
                        });
                }]
            })

            //All the same for remove except here we can take "id" as url param
            .state('users.remove', {
                url: '/remove/:ids',
                onEnter: ['$stateParams', '$state', '$modal', 'UserFactory', function ($stateParams, $state, $modal, UserFactory) {
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
                }]
            })
        ;
    }])

    //User page controller. Should be DRY.
    .controller('UsersPageCtrl', ['$scope', 'UserFactory', 'MessagesFactory', function ($scope, UserFactory, MessagesFactory) {


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
            UserFactory.getUsersList().then(function (data) {
                $scope.usersList = data;
            });
        })();

    }]);
'use strict';

angular.module('app.header', [])

    .directive('mainHeader', ['$state', function ($state) {
        return {
            restrict: 'E',
            scope: {},
            replace: true,
            templateUrl: 'header/header.html',
            link: function (scope) {
                scope.$state = $state;
            }
        };
    }])
;
'use strict';

angular.module('app.pages.users.modals.add_user', [])
    .controller('AddUsersPageCtrl', ['$modalInstance', '$scope', 'UserFactory', 'MessagesFactory', function ($modalInstance, $scope, UserFactory, MessagesFactory) {

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

    }])
;
'use strict';

angular.module('app.pages.users.modals.remove_user', [])
    .controller('RemoveUserModalController', ['$scope', '$modalInstance', 'UserFactory', '$stateParams', 'userData', 'MessagesFactory', function ($scope, $modalInstance, UserFactory, $stateParams, userData, MessagesFactory) {

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

    }])
;