var app = angular.module('app');

app.directive('showLogin', function($state) {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            var login = element.find('#login-holder');
            var loginError = element.find('#login-error');
            var main = element.find('#content');
            var username = element.find('#username');
            var password = element.find('#password');

            login.hide();
            loginError.hide();

            scope.$on('event:auth-loginRequired', function() {
                console.log('showing login form');
                $state.go("login");
            });
            scope.$on('event:auth-loginFailed', function() {
                console.log('showing login error message');
            });
            scope.$on('event:auth-loginConfirmed', function() {
                console.log('hiding login form');
                $state.go("index");
            });
        }
    }
});

function getLocalToken() {
    return localStorage["authToken"];
}

function getHttpConfig() {
    return {
        headers: {
            'X-Auth-Token': getLocalToken()
        }
    };
}

function getAuthenticateHttpConfig() {
    return {
        ignoreAuthModule: true
    };
}