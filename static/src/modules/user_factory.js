'use strict';

angular.module('app.user.factory', [])
    .factory('UserFactory', function (MessagesFactory, urlMap, $resource) {

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

    })

;
