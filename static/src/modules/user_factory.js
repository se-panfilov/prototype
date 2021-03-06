'use strict';

//Factory to get data from the backend
angular.module('app.user.factory', [])
    .factory('UserFactory', function (MessagesFactory, urlMap, $resource) {

        //Here we get route from url_map file
        //url_map generated by gulp from url_map.json
        //url_map.json should be generated by backend
        //to prevent problem with route changes
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

        //Public methods (returns promises)
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
