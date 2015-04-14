var app = angular.module('app');

app.controller('RootCtrl', function ($scope, $state, UserService) {
    $scope.isAuthencticated = function () {
        return !!getLocalToken();
    };

    $scope.getUser = function () {
        return UserService.getAuthUser();
    };

    $scope.logOut = function () {
        localStorage.removeItem("username");
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");

        $state.go($state.current.name, $state.params, { reload: true });
    };
});

app.controller('IndexCtrl', function ($scope) {

});

app.controller('FooterCtrl', function ($scope, $state, UserService, AnonymousUserService, HistoricalDataService) {
    $scope.startNow = function () {
        AnonymousUserService.addActivity("Call to action clicked in footer");
        if (UserService.isAuthencticated()) {
            $state.go('investment');
        } else {
            $state.go('signup');
        }
    };
});

app.controller('CallToActionCtrl', function ($scope, $state, UserService, AnonymousUserService) {
    AnonymousUserService.addActivity("Showing call to action");

    $scope.monthlyInvestment = 200;

    $scope.calcResults = 0;

    var calculateInvestmentUs = function (investment_per_month) {
        var length = 5 * 12; //years * months
        var sum = 0;
        var interest = 101.049 / 100; // VTI yield 2014 12,59%, per month on average 1.049%
        var transfer_fee_presentage = (100 - 1) / 100; // convert to %, money spent on transfer fee

        var after_transfer_fee = (investment_per_month * transfer_fee_presentage);

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
        var transfer_fee_presentage = 1 / 100; // convert to %, money spent on transfer fee
        var transfer_fee_presentage_multiply = (100 - 1) / 100; // convert to %, money spent on transfer fee
        var currency_exchange = (100 - 1.8) / 100; // convert to %, money lost on currency exchange

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


    $scope.$watch('monthlyInvestment', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            console.log('User typed value:' + newVal);
            AnonymousUserService.addActivity("User typed " + newVal + " as the monthly investment");
        }
        $scope.investUsCalcResults = Math.round(calculateInvestmentUs(newVal)) - (newVal * 12 * 5);
        $scope.calcResults = Math.round(calculateInvestmentUs(newVal) - calculateInvestmentSumLHVkasvu(newVal));
    });

    $scope.startNow = function () {
        AnonymousUserService.addActivity("Call to action clicked");
        if (UserService.isAuthencticated()) {
            $state.go('investment');
        } else {
            $state.go('signup');
        }
    };
});

app.controller('InvestmentCtrl', function ($scope, UserService, UserInvestments, CreateInvestment, UserService, $state, AnonymousUserService) {
    if (!UserService.isAuthencticated()) {
        AnonymousUserService.addActivity("Unauthenticated user trying to access investments");
        $state.go('login');
    }

    $scope.investedSum = UserInvestments.get({userId: UserService.getAuthUser().id});

    $scope.amount = 0;

    $scope.state = 'none';

    $scope.showInvest = function () {
        CreateInvestment.get({username: UserService.getAuthUser().username, amount: $scope.amount}, function () {
            $scope.investedSum = UserInvestments.get({userId: UserService.getAuthUser().id});
        });
        $scope.state = 'invest'
    };

    $scope.showSell = function () {
        CreateInvestment.get({username: UserService.getAuthUser().username, amount: $scope.amount * -1}, function () {
            $scope.investedSum = UserInvestments.get({userId: UserService.getAuthUser().id});
        });
        $scope.state = 'sell'
    };
});

app.controller('SignupCtrl', function ($scope, UserAddService, $state, AnonymousUserService) {
    $scope.data = {};
    $scope.notifications = {};

    AnonymousUserService.addActivity("Viewing signup page");


    $scope.save = function () {
        $scope.notifications = {};

        if ($scope.signup.$invalid) {
            $scope.notifications.msg = "The form has errors!";
            AnonymousUserService.addActivity("Signup form has errors: " + $scope.signup.$error);
            return;
        }

        if ($scope.data.password != $scope.data.password2) {
            $scope.notifications.msg = "Passwords do not match!";
            AnonymousUserService.addActivity("Signup form passwords not matching");
            return;
        }

        console.log("Creating new user");
        AnonymousUserService.addActivity("Creating new user");

        UserAddService.addUser({
            username: $scope.data.email,
            fullName: $scope.data.fullName,
            password: $scope.data.password,
            dateOfBirth: $scope.data.dateOfBirth
        }, function (result) {
            console.log('User added' + result);
            AnonymousUserService.addActivity("User " + $scope.data.email + " successfully added");
            $state.go("sorry");
        }, function (err) {
            if (err.status === 400) {
                $scope.notifications.msg = err.data;
            }
            console.error(err);
            AnonymousUserService.addActivity("Signup failed with error for user " + $scope.data.email + ": " + err);
        })
    }
});
app.controller('AboutCtrl', function ($scope, AnonymousUserService) {
    AnonymousUserService.addActivity("Viewing about page");
});

app.controller('SorryCtrl', function ($scope, AnonymousUserService) {
    AnonymousUserService.addActivity("Viewing sorry page");
});

app.controller('LoginCtrl', function ($rootScope, $scope, $http, authService, AnonymousUserService, User) {
        console.log('loginController called');
        AnonymousUserService.addActivity("Viewing login page");

        $scope.logIn = function () {
            console.log('logIn called');
            AnonymousUserService.addActivity("Logging in as user " + $scope.authData.username);

            $http.post('/auth/login', {username: $scope.authData.username, password: $scope.authData.password},
                getAuthenticateHttpConfig).
                success(function (data) {
                    console.log('authentication token: ' + data.access_token);
                    localStorage["authToken"] = data.access_token;
                    localStorage["username"] = data.username;
                    User.get({username: data.username}, function (data) {
                        localStorage["user"] = angular.toJson(data);
                    });
                    authService.loginConfirmed({}, function (config) {
                        if (!config.headers["X-Auth-Token"]) {
                            console.log('X-Auth-Token not on original request; adding it');
                            config.headers["X-Auth-Token"] = getLocalToken();
                        }
                        return config;
                    });
                }).
                error(function (data) {
                    AnonymousUserService.addActivity("Login for user " + $scope.authData.username + " failed with message: " + data);
                    console.log('login error: ' + data);
                    $rootScope.$broadcast('event:auth-loginFailed', data);
                });
        }
    }
);

app.controller('logoutCtrl', function ($scope, $http, $location, UserService, AnonymousUserService) {
        console.log('logoutController called');

        $scope.logOut = function () {
            console.log('logOut called');
            AnonymousUserService.addActivity("Logging out user " + UserService.getAuthenticatedUser());

            $http.post('/auth/logout', {}, getHttpConfig()).
                success(function () {
                    console.log('logout success');
                    AnonymousUserService.addActivity("Logout success");
                    localStorage.clear();
                    $location.path("/")
                }).
                error(function (data) {
                    AnonymousUserService.addActivity("Logout error " + data);
                    console.log('logout error: ' + data);
                });
        }
    }
);
