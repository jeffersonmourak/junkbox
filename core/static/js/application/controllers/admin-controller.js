(function() {
    "use strict";
    angular.module('admin', [])
        .controller('dashboard', function($scope, $sce, $http, $interval) {


            function parseDate(dates) {
                var data = [];
                for (var i in dates) {
                    var date = dates[i];
                    var dateObject = new Date(date);

                    if (data[dateObject.getHours()] === undefined) {
                        data[dateObject.getHours()] = 0;
                    }
                    data[dateObject.getHours() + ""]++;
                }
                return data;
            }

            function generateChart(datas) {
                var chart = [
                    ['Hora', 'Twitter', 'Instagram'],
                    ['INICIO', 0, 0]
                ];

                if(datas[0].length > datas[1].length){
                    var n = datas[1];
                    datas[1] = datas[0];
                    datas[0] = n;
                }

                function findInChart(day) {
                    for (var i = 1; i < chart.length; i++) {
                        var object = chart[i];
                        if (object !== undefined && object[0] == day) {
                            return i;
                        }
                    }
                    return -1
                }
                var j = 2;

                for (var i in datas[1]) {
                    var thisHour = datas[1][i];
                    var index = findInChart(i);
                    if (index == -1) {
                        chart[j] = [i + "", 0, thisHour];
                        j++;
                    } else {
                        var chartItem = chart[index];
                        chartItem[2] = thisHour;
                    }
                }

                j = 2;
                for (var i in datas[0]) {
                    var thisHour = datas[0][i];
                    var index = findInChart(i);
                    if (index == -1) {
                        chart[j] = [i + "", thisHour, 0];
                        j++;
                    } else {
                        var chartItem = chart[index];
                        chartItem[1] = thisHour;
                    }
                }

                console.log(chart);
                return chart;
            }

            $scope.analytics = {};
            $scope.analytics.instagram = [];
            $scope.analytics.twitter = [];
            $interval(function() {
                $http.get("http://localhost:3001/api/analytics").then(function(response) {
                    $scope.analytics.instagram = parseDate(response.data.instagram);
                    $scope.analytics.twitter = parseDate(response.data.twits);

                    drawChart(generateChart([$scope.analytics.twitter, $scope.analytics.instagram]));
                    
                });
            }, 5000);

        });

})()
