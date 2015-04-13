var app = angular.module('app', ['ngResource', 'ui.router', 'http-auth-interceptor', 'nvd3ChartDirectives']);

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'views/index.html',
            controller: 'IndexCtrl'
        })
        .state('investment', {
            url: '/investment',
            templateUrl: 'views/investment.html',
            controller: 'InvestmentCtrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'views/signup.html',
            controller: 'SignupCtrl'
        })
        .state('sorry', {
            url: '/sorry',
            templateUrl: 'views/sorry.html',
            controller: 'SorryCtrl'
        })
        .state('about', {
            url: '/about',
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl'
        });
});
