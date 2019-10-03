"use strict";

var app = angular.module('ngApp', ['ngRoute', 'angular.filter', 'ngAnimate', 'ngMessages']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            templateUrl: "views/home.html",
            controller: "HomeController"
        })
        .otherwise({
            templateUrl: "views/not-found.html"
        });

}]);

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.withCredentials = false;
}]);

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

app.config(['$httpProvider', function ($httpProvider) {

    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};

}]);
