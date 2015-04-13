var app = angular.module('app');

app.factory('Investments', function ($resource) {
    return $resource('/investments');
});


app.factory('UserInvestments', function ($resource) {
    return $resource('/investments/index/1');
});

app.factory('CreateInvestment', function ($resource) {
    return $resource('/investments/create/1?user=test%40test%2Eee&amount=:amount', {amount: '@amount'});
});

app.factory('HistoricalDataService', function ($resource) {
    return $resource('/stats/graphStats/5', {}, {
        query: {method: 'GET', isArray: true}
    });
});

app.factory('UserAddService', function ($resource) {
    return $resource('/user/add', {}, {
        addUser: {method: 'POST'}
    });
});

app.factory('d3Service', function ($document, $window, $q, $rootScope) {
        var d = $q.defer(),
            d3service = {
                d3: function () {
                    return d.promise;
                }
            };

        function onScriptLoad() {
            // Load client in the browser
            $rootScope.$apply(function () {
                d.resolve($window.d3);
            });
        }

        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = 'http://d3js.org/d3.v3.min.js';
        scriptTag.onreadystatechange = function () {
            if (this.readyState == 'complete') {
                onScriptLoad();
            }
        };
        scriptTag.onload = onScriptLoad;

        var s = $document[0].getElementsByTagName('body')[0];
        s.appendChild(scriptTag);

        return d3service;
    }
);
