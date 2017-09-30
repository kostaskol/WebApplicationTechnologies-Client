var app = angular.module('airbnbApp')

app.controller('searchResultsCtrl', ['$scope', '$rootScope', '$routeParams', 'HttpCall',
    function($scope, $rootScope, $routeParams, HttpCall) {
        console.log("Called");

        function copy(array) {
            var tmp = [];
            for (var i = 0; i < array.length; i++) {
                tmp.push(array[i]);
            }
            return tmp;
        }

        $scope.timesChanged = 0;

        $scope.changePage = function(page) {
            var shown = $scope.pages.length - 1 > MAX_SHOWN ? MAX_SHOWN : ($scope.pages.length - 1);
            if (page === 0) {
                if ($scope.timesChanged === 0) return;
                $scope.timesChanged--;
                var tmp = ["<"];
                for (var i = $scope.timesChanged * MAX_SHOWN; i < ($scope.timesChanged + 1) * MAX_SHOWN; i++) {
                    tmp.push($scope.allPages[i]);
                }
                tmp.push(">");
                $scope.pages = tmp;
                // slide page array to the right by MAX_SHOWN
            } else if (page === shown) {
                // slide page array to the left by MAX_SHOWN
                if (($scope.timesChanged + 1) * MAX_SHOWN > $scope.allPages.length) return;

                $scope.timesChanged++;
                var max = MAX_SHOWN * $scope.timesChanged + MAX_SHOWN < $scope.allPages.length ? MAX_SHOWN : $scope.allPages.length;
                var tmp = ["<"];
                for (var i = $scope.timesChanged * MAX_SHOWN; i < max; i++) {
                    tmp.push($scope.allPages[i]);
                }
                tmp.push(">");
                $scope.pages = tmp;
            } else {
                var actualPage = MAX_SHOWN * $scope.timesChanged + page - 1;
                var start = actualPage * PAGE_SIZE;
                var end = $scope.allHouses.length > start + PAGE_SIZE ? start + PAGE_SIZE : $scope.allHouses.length;
                var tmp = copy($scope.allHouses);
                $scope.houses = tmp.splice(start, end);
            }
        };

        var success = function(response) {
            if (response.data.length === 0) {
                $scope.none = true;
            } else {
                $scope.none = false;
                $scope.allHouses = response.data;
                var tmp = copy($scope.allHouses);
                $scope.houses = tmp.splice(0, PAGE_SIZE);
                $scope.pageNum = Math.floor($scope.houses.length / PAGE_SIZE + 1);
                $scope.allPages = [];
                for (var i = 0; i < Math.floor($scope.allHouses.length / PAGE_SIZE); i++) {
                    $scope.allPages.push(i + 1);
                }
                $scope.pages = ["<"];
                var max = $scope.pageNum > MAX_SHOWN ? MAX_SHOWN : $scope.pageNum;
                for (var i = 0; i < max; i++) {
                    $scope.pages.push(i + 1);
                }
                $scope.pages.push(">");
                console.log("Pages = " + $scope.pages);
            }
        };

        var failure = function(response) {
            $scope.none = true;
        };

        HttpCall.postJson("house/search", $routeParams, success, failure);
    }
]);
