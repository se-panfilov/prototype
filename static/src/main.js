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
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
        //Our default route
        $urlRouterProvider.otherwise('/users');
        //Here we can intercept and process errors, like "unauthorized"
        //$httpProvider.interceptors.push('errorsInterceptors');
    })
;
