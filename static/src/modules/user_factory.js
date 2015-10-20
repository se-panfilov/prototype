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

        //Because there is no backend, e will use lockal storage
        return {
            getUsersList: function () {
                return _userApi.user.get(function () {
                    //
                }, function (response) {
                    //show some error
                }).$promise;
            },
            getUser: function (id) {
                return _userApi.user.get({id: id}, function () {
                    //
                }, function (response) {
                    //show some error
                }).$promise;
            },
            addUser: function () {
                return _userApi.user.add(function () {
                    //
                }, function (response) {
                    //show some error
                }).$promise;
            },
            removeUser: function (id) {
                return _userApi.user.remove({id: id}, function () {
                    //
                }, function (response) {
                    //show some error
                }).$promise;
            }
        };

    })

;
