var app = angular.module('app');

app.service('UserService', function () {
    this.getAuthenticatedUser = function () {
        return localStorage["username"];
    }
});