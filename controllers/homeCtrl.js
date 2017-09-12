var app = angular.module('airbnbApp');

app.controller('homeCtrl', ['fileUploadService', '$scope', '$http', '$rootScope', '$location', '$cookies',
    function (fileUploadService, $scope, $http, $rootScope, $location, $cookies) {
        $scope.houseListStyle = {
            "margin": "auto",
            "width": "90%"
        };
        
        $scope.loaded = false;
        $scope.houseInfo = [];
        $scope.timesChanged = 0;

        $scope.loggedIn = $cookies.get("loggedIn") === "true";

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
            url: SERVER_URL + "/house/getpage/0?force=true&timestamp=null",
            method: "GET"
        }).then( /* success */ function (response) {
            $scope.houseInfo = response.data.houses;
            $scope.allPages = response.data.numPages;


            $scope.pages = ["<"];
            console.log("Length: " + $scope.houseInfo.length);
            for (var i = 0; i < Math.floor($scope.houseInfo.length / PAGE_SIZE) + 1; i++) {
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
            } else if (index === shown) {
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
                var actualPage = MAX_SHOWN * $scope.timesChanged + index - 1;
                console.log("Getting houses from server");
                $http({
                    url: SERVER_URL + "/house/getpage/" + actualPage,
                    method: "GET"
                }).then( /* success */ function (response) {
                    $scope.houseInfo = response.data.houses;
                    var date = new Date();
                    HouseService.createHouses(response.data.houses, getParseableDate(new Date()), actualPage);
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
