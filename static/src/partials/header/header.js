'use strict';

angular.module('app.header', [])

    .directive('mainHeader', function ($state) {
        return {
            restrict: 'E',
            scope: {},
            replace: true,
            templateUrl: 'header/header.html',
            link: function (scope) {
                scope.$state = $state;
            }
        };
    })
;