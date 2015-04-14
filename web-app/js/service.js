var app = angular.module('app');

app.service('UserService', function () {
    this.getAuthenticatedUser = function () {
        return localStorage["username"];
    };

    this.isAuthencticated = function () {
        return getLocalToken() !== undefined;
    };

    this.getAuthUser = function () {
        return angular.fromJson(localStorage["user"]);
    }
});

app.service('AnonymousUserService', function (AnonymousUser, AnonymousMetric) {
    var anonymousUserUuid = localStorage["anonymousUuid"];

    var saveData = function (userUuid, activityDesc) {
        console.log("the value: " + userUuid);
        AnonymousMetric.save(
            {uuid: userUuid, activity: activityDesc},
            function (response) {
            }, function (err) {
                console.error("Error occurred!");
                console.error(err);
            }
        );
    };

    this.addActivity = function (activityDesc) {
        if (anonymousUserUuid) {
            saveData(anonymousUserUuid, activityDesc);
        } else {
            AnonymousUser.get({}, function (data) {
                anonymousUserUuid = data.uuid;
                localStorage["anonymousUuid"] = anonymousUserUuid;
                saveData(anonymousUserUuid, activityDesc);
            }, function (err) {
                console.error("Error occurred when asking for anonymous user", err);
            });
        }
    };
});