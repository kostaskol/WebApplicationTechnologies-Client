var app = angular.module('airbnbApp');

app.controller('homeCtrl', ['$scope', '$rootScope', '$location', '$cookies', '$window', 'HttpCall',
    function ($scope, $rootScope, $location, $cookies, $window, HttpCall) {
        $scope.houseListStyle = {
            "margin": "auto",
            "width": "90%"
        };
        
        $scope.loaded = false;
        $scope.houseInfo = [];
        $scope.timesChanged = 0;

        $scope.loggedIn = $cookies.get("loggedIn") === "true";
        $scope.hasPredicted = $cookies.get("predicted") === "true";
        $scope.currentPage = 1;
        $scope.predicting = false;

        if ($cookies.get("token") !== null && $cookies.get("token") !== "") {

            var verifySuccess = function(response) {
                $scope.loggedIn = true;
                $cookies.put("loggedIn", true);
            };

            var verifyFailure = function(response) {
                $scope.loggedIn = false;
                $cookies.put("loggedIn", false);
            };

            HttpCall.postText("user/verifytoken", $cookies.get("token"), verifySuccess, verifyFailure);
        }

        var numPageSuccess = function(response) {
            $scope.numPages = response.data;
            $scope.allPages = [];
            for (var i = 0; i < response.data; i++) {
                $scope.allPages.push(i + 1);
            }
        };

        HttpCall.get("house/getnumpages", numPageSuccess, generalFailure);

        var pageSuccess = function(response) {
            $scope.houseInfo = response.data;

            $scope.pages = ["<"];
            for (var i = 0; i < $scope.allPages.length + 1 && i < MAX_SHOWN; i++) {
                $scope.pages.push(i + 1);
            }
            $scope.pages.push(">");

            $scope.houseInfo.sort(function (a, b) {
                if (a.minCost > b.minCost) return 1;
                if (a.minCost < b.minCost) return -1;
                return 0;
            });
            $scope.loaded = true;
        };

        var pageFailure = function(response) {
            $scope.loaded = true;
            window.alert("Server not running");
        };

        HttpCall.get("house/getpage/0", pageSuccess, pageFailure);

        
        $scope.getPredicted = function() {
            $scope.predicting = true;
            var predSuccess = function(response) {
                if (response.data.status === STATUS_NOT_ENOUGH_DATA) {
		    console.log("Not enough data 2");
                    $scope.hasPredicted = false;
                    return;
                }
                $scope.predicted = response.data;
                sessionStorage.setItem("predicted", JSON.stringify(response.data));
                $cookies.put("predicted", "true");
                $scope.hasPredicted = true;
            };


            HttpCall.postText("house/getpredicted", $cookies.get("token"),
                predSuccess, generalFailure);

            $scope.predicting = false;

        };

        if ($scope.loggedIn && !$scope.hasPredicted) {
            $scope.getPredicted();
        } else {
            $scope.predicted = window.JSON.parse(sessionStorage.getItem("predicted"));
            if ($scope.predicted === null) {
                $cookies.put("predicted", "false");
                $scope.getPredicted();
            }
        }

        $scope.getPage = function (index) {
            var shown = $scope.pages.length - 1 > MAX_SHOWN ? MAX_SHOWN : ($scope.pages.length - 1);
            if (index === 0) {
                if ($scope.timesChanged === 0) return;
                $scope.timesChanged--;
                var tmp = ["<"];
                for (var i = $scope.timesChanged * MAX_SHOWN; i < ($scope.timesChanged + 1) * MAX_SHOWN; i++) {
                    tmp.push($scope.allPages[i]);
                }
                tmp.push(">");
                $scope.pages = tmp;
                // slide page array to the right by MAX_SHOWN
            } else if (index === $scope.pages.length - 1) {
                // slide page array to the left by MAX_SHOWN
                if (($scope.timesChanged + 1) * MAX_SHOWN > $scope.allPages.length) return;

                $scope.timesChanged++;
                var max = MAX_SHOWN * $scope.timesChanged + MAX_SHOWN < $scope.allPages.length ?
                    $scope.timesChanged * MAX_SHOWN + MAX_SHOWN : $scope.allPages.length;

                var tmp = ["<"];
                for (var i = $scope.timesChanged * MAX_SHOWN; i < max; i++) {
                    tmp.push($scope.allPages[i]);
                }
                tmp.push(">");
                $scope.pages = tmp;
            } else {
                var actualPage = MAX_SHOWN * $scope.timesChanged + index - 1;
                $scope.currentPage = actualPage + 1;

                var getPageSuccess = function(response) {
                    $scope.houseInfo = response.data;
                    var date = new Date();
                    $scope.houseInfo.sort(function (a, b) {
                        if (a.minCost > b.minCost) return 1;
                        if (a.minCost < b.minCost) return -1;
                        return 0;
                    });
                };


                HttpCall.get("house/getpage/" + actualPage, getPageSuccess, generalFailure);
            }
        };
    }
]);
