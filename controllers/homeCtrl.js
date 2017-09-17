var app = angular.module('airbnbApp');

app.controller('homeCtrl', ['fileUploadService', '$scope', '$http', '$rootScope', '$location', '$cookies', '$window',
    function (fileUploadService, $scope, $http, $rootScope, $location, $cookies, $window) {
        $scope.houseListStyle = {
            "margin": "auto",
            "width": "90%"
        };
        
        $scope.loaded = false;
        $scope.houseInfo = [];
        $scope.timesChanged = 0;

        $scope.loggedIn = $cookies.get("loggedIn") === "true";
        $scope.currentPage = 1;

        if (!$scope.loggedIn) {
            $http({
                url: SERVER_URL + "/user/verifytoken",
                data: $cookies.get("token"),
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                }
            }).then( /* success */ function (response) {
                $scope.loggedIn = true;
                $cookies.put("loggedIn", true);
            }, /* failure */ function (response) {
                $scope.loggedIn = false;
                $cookies.put("loggedIn", false);
            });
        }
        
        $http({
            url: SERVER_URL + "/house/getnumpages",
            method: "GET"
        }).then(/* success */ function(response) {
            $scope.numPages = response.data;
            $scope.allPages = [];
            for (var i = 0; i < response.data; i++) {
                $scope.allPages.push(i + 1);
            }
        }, /* failure */ function(response) {
            
        });

        $http({
            url: SERVER_URL + "/house/getpage/0",
            method: "GET"
        }).then( /* success */ function (response) {
            $scope.houseInfo = response.data.houses;

            $scope.pages = ["<"];
            console.log("Length: " + $scope.houseInfo.length);
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
        }, /* failure */ function (response) {
            $scope.loaded = true;
            window.alert("Server not running");
            console.log("Failed: " + JSON.stringify(response));
        });
        
        $scope.getPredicted = function() {
            $http({
                url: SERVER_URL + "/house/getpredicted",
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                data: $cookies.get("token")
            }).then(/* success */ function(response) {
                $scope.predicted = response.data;
                localStorage.setItem("predicted", JSON.stringify(response.data));
                $cookies.put("predicted", "true");
            }, /* failure */ function(response) {
                console.log(response.data);
            });
        }

        if ($cookies.get("loggedIn") == "true" && $cookies.get("predicted") == "false") {
            $scope.getPredicted();
        } else {
            $scope.predicted = window.JSON.parse(localStorage.getItem("predicted"));
            if ($scope.predicted == null) {
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
                console.log("Go right");
                if (($scope.timesChanged + 1) * MAX_SHOWN > $scope.allPages.length) return;

                $scope.timesChanged++;
                console.log("Times changed = " + $scope.timesChanged);
                var max = MAX_SHOWN * $scope.timesChanged + MAX_SHOWN < $scope.allPages.length ? $scope.timesChanged * MAX_SHOWN + MAX_SHOWN : $scope.allPages.length;
                var tmp = ["<"];
                for (var i = $scope.timesChanged * MAX_SHOWN; i < max; i++) {
                    console.log("Pushing " + $scope.allPages[i]);
                    tmp.push($scope.allPages[i]);
                }
                tmp.push(">");
                $scope.pages = tmp;
            } else {
                var actualPage = MAX_SHOWN * $scope.timesChanged + index - 1;
                $scope.currentPage = actualPage + 1;
                console.log("Requesting page #" + actualPage);
                $http({
                    url: SERVER_URL + "/house/getpage/" + actualPage,
                    method: "GET"
                }).then( /* success */ function (response) {
                    $scope.houseInfo = response.data.houses;
                    console.log("Length: " + $scope.houseInfo.length);
                    var date = new Date();
                    console.log($scope.houseInfo);
                    $scope.houseInfo.sort(function (a, b) {
                        if (a.minCost > b.minCost) return 1;
                        if (a.minCost < b.minCost) return -1;
                        return 0;
                    });
                }, /* failure */ function (response) {

                });
            }
        };
    }
]);
