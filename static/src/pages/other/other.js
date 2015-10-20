'use strict';

angular.module('app.pages.other', [
    'ui.router'
])

    .config(function ($stateProvider) {
        $stateProvider
            .state('other', {
                url: '/other',
                templateUrl: 'other/other.html',
                controller: 'OtherPageCtrl'
            })
        ;
    })

    .controller('OtherPageCtrl', function () {

    });