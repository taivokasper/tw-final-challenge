var app = angular.module('app');

app.directive('d3Bars', function ($window, $timeout, d3Service) {
        return {
            restrict: 'A',
            scope: {
                data: '=',
                label: '@',
                onClick: '&'
            },
            link: function (scope, ele, attrs) {
                var margin = {top: 20, right: 20, bottom: 30, left: 50},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                var parseDate = d3.time.format("%d-%b-%y").parse;

                var x = d3.time.scale()
                    .range([0, width]);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                var line = d3.svg.line()
                    .x(function (d) {
                        return x(d.date);
                    })
                    .y(function (d) {
                        return y(d.close);
                    });

                var svg = d3.select("body").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                d3.tsv("data.tsv", function (error, data) {
                    data.forEach(function (d) {
                        d.date = parseDate(d.date);
                        d.close = +d.close;
                    });

                    x.domain(d3.extent(data, function (d) {
                        return d.date;
                    }));
                    y.domain(d3.extent(data, function (d) {
                        return d.close;
                    }));

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("Price ($)");

                    svg.append("path")
                        .datum(data)
                        .attr("class", "line")
                        .attr("d", line);
                });
            },
            link: function (scope, ele, attrs) {
                d3Service.d3().then(function (d3) {

                    var renderTimeout;
                    var margin = parseInt(attrs.margin) || 20,
                        barHeight = parseInt(attrs.barHeight) || 20,
                        barPadding = parseInt(attrs.barPadding) || 5;

                    var svg = d3.select(ele[0])
                        .append('svg')
                        .style('width', '100%');

                    $window.onresize = function () {
                        scope.$apply();
                    };

                    scope.$watch(function () {
                        return angular.element($window)[0].innerWidth;
                    }, function () {
                        scope.render(scope.data);
                    });

                    scope.$watch('data', function (newData) {
                        scope.render(newData);
                    }, true);

                    scope.render = function (data) {
                        svg.selectAll('*').remove();

                        if (!data) return;
                        if (renderTimeout) clearTimeout(renderTimeout);

                        renderTimeout = $timeout(function () {
                            var width = d3.select(ele[0])[0][0].offsetWidth - margin,
                                height = scope.data.length * (barHeight + barPadding),
                                color = d3.scale.category20(),
                                xScale = d3.scale.linear()
                                    .domain([0, d3.max(data, function (d) {
                                        return d.score;
                                    })])
                                    .range([0, width]);

                            svg.attr('height', height);

                            svg.selectAll('rect')
                                .data(data)
                                .enter()
                                .append('rect')
                                .on('click', function (d, i) {
                                    return scope.onClick({item: d});
                                })
                                .attr('height', barHeight)
                                .attr('width', 140)
                                .attr('x', Math.round(margin / 2))
                                .attr('y', function (d, i) {
                                    return i * (barHeight + barPadding);
                                })
                                .attr('fill', function (d) {
                                    return color(d.score);
                                })
                                .transition()
                                .duration(1000)
                                .attr('width', function (d) {
                                    return xScale(d.score);
                                });
                            svg.selectAll('text')
                                .data(data)
                                .enter()
                                .append('text')
                                .attr('fill', '#fff')
                                .attr('y', function (d, i) {
                                    return i * (barHeight + barPadding) + 15;
                                })
                                .attr('x', 15)
                                .text(function (d) {
                                    return d.name + " (scored: " + d.score + ")";
                                });
                        }, 200);
                    };
                });
            }
        }
    }
);

app.directive('showLogin', function ($state) {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            var login = element.find('#login-holder');
            var loginError = element.find('#login-error');
            var main = element.find('#content');
            var username = element.find('#username');
            var password = element.find('#password');

            login.hide();
            loginError.hide();

            scope.$on('event:auth-loginRequired', function () {
                console.log('showing login form');
                $state.go("login");
            });
            scope.$on('event:auth-loginFailed', function () {
                console.log('showing login error message');
            });
            scope.$on('event:auth-loginConfirmed', function () {
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