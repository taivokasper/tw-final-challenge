var app = angular.module('app');

app.factory('Investments', function($resource) {
    return $resource('/investments');
});