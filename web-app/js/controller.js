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

app.controller('FooterCtrl', function ($scope, HistoricalDataService) {
    $scope.data = [];

    HistoricalDataService.query({}, function (result) {
        result.forEach(function (d) {
            $scope.data.push({
                date: new Date(d.date),
                score: d.open
            });
        });
        console.log($scope.data);
    });
});

app.controller('CallToActionCtrl', function ($scope, $state, UserService) {
    $scope.monthlyInvestment = 200;

    $scope.calcResults = 0;

    var calculateInvestmentUs = function (investment_per_month) {
        var length = 5 * 12; //years * months
        var sum = 0;
        var interest = 101.049 / 100; // VTI yield 2014 12,59%, per month on average 1.049%
        var transfer_fee_presentage = (100 - 1) / 100; // convert to %, money spent on transfer fee

        var after_transfer_fee = (investment_per_month * transfer_fee_presentage)

        for (var i = 0; i < length; i++) {
            sum = (sum + after_transfer_fee) * interest;
        }
        return sum;
    };


    var calculateInvestmentSumLHVkasvu = function (investment_per_month) {
        var length = 5 * 12; //years * months
        var sum = 0;
        var interest = 101.049 / 100; // VTI yield 2014 12,59%, per month on average 1.049%
        var every_mont_fee = 0.05 / 100; // convert to %
        var every_month_min_fee = 1;

        var transfer_fee_fix = 2;
        var transfer_fee_presentage = 1 / 100 // convert to %, money spent on transfer fee
        var transfer_fee_presentage_multiply = (100 - 1) / 100 // convert to %, money spent on transfer fee
        var currency_exchange = (100 - 1.8) / 100 // convert to %, money lost on currency exchange

        var after_transfer_fee = 0;
        if (investment_per_month < (transfer_fee_fix / transfer_fee_presentage)) {
            after_transfer_fee = investment_per_month - transfer_fee_fix;
        } else {
            after_transfer_fee = (investment_per_month * transfer_fee_presentage_multiply);
        }
        var after_currency_exchange = (after_transfer_fee * currency_exchange);

        for (var i = 0; i < length; i++) {
            sum = (sum + after_currency_exchange) * interest;
            if (sum < (every_month_min_fee / every_mont_fee)) {
                sum -= every_month_min_fee;
            } else {
                sum -= (sum * every_mont_fee)
            }
        }
        return sum;
    };


    $scope.$watch('monthlyInvestment', function (newVal) {
        $scope.investUsCalcResults = Math.round(calculateInvestmentUs(newVal)) - (newVal * 12 * 5);
        $scope.calcResults = Math.round(calculateInvestmentUs(newVal) - calculateInvestmentSumLHVkasvu(newVal));
    });

    $scope.startNow = function () {
        if (UserService.isAuthencticated()) {
            $state.go('investment');
        } else {
            $state.go('login');
        }
    };
});

app.controller('InvestmentCtrl', function ($scope, UserInvestments, CreateInvestment, $window) {
    $scope.investedSum = UserInvestments.get();

    $scope.amount = 0;

    $scope.state = 'none';

    $scope.showInvest = function () {
        CreateInvestment.get({amount: $scope.amount}, function () {
            $scope.investedSum = UserInvestments.get();
        });
        $scope.state = 'invest'
    };

    $scope.showSell = function () {
        CreateInvestment.get({amount: $scope.amount * -1}, function () {
            $scope.investedSum = UserInvestments.get();
        });
        $scope.state = 'sell'
    };
});

app.controller('SignupCtrl', function ($scope) {

});
app.controller('AboutCtrl', function ($scope) {

});

app.controller('LoginCtrl', function ($rootScope, $scope, $http, authService) {
        console.log('loginController called');

        $scope.logIn = function () {
            console.log('logIn called');

            $http.post('/auth/login', {username: $scope.authData.username, password: $scope.authData.password},
                getAuthenticateHttpConfig).
                success(function (data) {
                    console.log('authentication token: ' + data.access_token);
                    localStorage["authToken"] = data.access_token;
                    localStorage["username"] = data.username;
                    authService.loginConfirmed({}, function (config) {
                        if (!config.headers["X-Auth-Token"]) {
                            console.log('X-Auth-Token not on original request; adding it');
                            config.headers["X-Auth-Token"] = getLocalToken();
                        }
                        return config;
                    });
                }).
                error(function (data) {
                    console.log('login error: ' + data);
                    $rootScope.$broadcast('event:auth-loginFailed', data);
                });
        }
    }
);

app.controller('logoutCtrl', function ($scope, $http, $location) {
        console.log('logoutController called');

        $scope.logOut = function () {
            console.log('logOut called');

            $http.post('/auth/logout', {}, getHttpConfig()).
                success(function () {
                    console.log('logout success');
                    localStorage.clear();
                    $location.path("/")
                }).
                error(function (data) {
                    console.log('logout error: ' + data);
                });
        }
    }
);
