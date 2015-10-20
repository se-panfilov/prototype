'use strict';

angular.module('app.pages.other', [
    'ui.router'
])

    //Base page route
    .config(function ($stateProvider) {
        $stateProvider
            .state('other', {
                url: '/other',
                templateUrl: 'other/other.html',
                controller: 'OtherPageCtrl'
            })
        ;
    })

    //Page controller
    .controller('OtherPageCtrl', function () {

    });