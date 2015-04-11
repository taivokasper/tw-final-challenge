var app = angular.module('app');

app.controller('RootCtrl', function ($scope, UserService) {
    $scope.isAuthencticated = function () {
        return !!getLocalToken();
    };

    $scope.getUser = function () {
        return UserService.getAuthenticatedUser();
    };
});

app.controller('IndexCtrl', function ($scope) {

});

app.controller('CallToActionCtrl', function ($scope, $state, UserService) {
    $scope.monthlyInvestment = 200;

    $scope.calcResults = 0;

    var calculateInvestmentUs = function(investment_per_month) {
        var length = 5 * 12; //years * months
        var sum = 0;
        var interest = 101.049 / 100; // VTI yield 2014 12,59%, per month on average 1.049%
        var transfer_fee_presentage = (100 - 1) / 100; // convert to %, money spent on transfer fee

        var after_transfer_fee = (investment_per_month * transfer_fee_presentage)

        for(var i = 0; i < length; i++){
            sum = (sum + after_transfer_fee) * interest;
        }
        return sum - investment_per_month * length;
    };

    $scope.$watch('monthlyInvestment', function (newVal) {
        $scope.calcResults = Math.round(calculateInvestmentUs(newVal));
    });

    $scope.startNow = function () {
        if (UserService.isAuthencticated()) {
            $state.go('investment');
        } else {
            $state.go('login');
        }
    };
});

app.controller('InvestmentCtrl', function ($scope) {

});

app.controller('SignupCtrl', function ($scope) {

});
app.controller('AboutCtrl', function ($scope) {

});

app.controller('LoginCtrl', function ($rootScope, $scope, $http, authService) {
        console.log('loginController called');

        $scope.logIn = function() {
            console.log('logIn called');

            $http.post('/auth/login', { username: $scope.authData.username, password: $scope.authData.password },
                    getAuthenticateHttpConfig).
                success(function(data) {
                    console.log('authentication token: ' + data.access_token);
                    localStorage["authToken"] = data.access_token;
                    localStorage["username"] = data.username;
                    authService.loginConfirmed({}, function(config) {
                        if(!config.headers["X-Auth-Token"]) {
                            console.log('X-Auth-Token not on original request; adding it');
                            config.headers["X-Auth-Token"] = getLocalToken();
                        }
                        return config;
                    });
                }).
                error(function(data) {
                    console.log('login error: ' + data);
                    $rootScope.$broadcast('event:auth-loginFailed', data);
                });
        }
    }
);

app.controller('logoutCtrl', function ($scope, $http, $location) {
        console.log('logoutController called');

        $scope.logOut = function() {
            console.log('logOut called');

            $http.post('/auth/logout', {}, getHttpConfig()).
                success(function() {
                    console.log('logout success');
                    localStorage.clear();
                    $location.path("/")
                }).
                error(function(data) {
                    console.log('logout error: ' + data);
                });
        }
    }
);
