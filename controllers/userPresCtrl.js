var app = angular.module('airbnbApp');

app.controller('userPresCtrl', ['$scope', '$http', '$routeParams', '$cookies', '$location', '$timeout',
	function ($scope, $http, $routeParams, $cookies, $location, $timeout) {
        $scope.userId = parseInt($routeParams.userId);
        $scope.gotResponse = false;

        $http({
            url: "http://localhost:8080/airbnb/rest/admin/get/" + $scope.userId,
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            data: $cookies.get('token')
        }).then( /* success */ function (response) {
            $scope.user = response.data;
            $scope.user.dateOfBirth = new Date($scope.user.dateOfBirth);
            if ($scope.user.approved) {
                $scope.approvedText = "User approved";
            } else {
                $scope.approvedText = "User not approved";
            }
        }, /* failure */ function (response) {

        });

        $scope.save = function () {
            $scope.user.token = $cookies.get('token');
            $http({
                url: "http://localhost:8080/airbnb/rest/admin/alteruser/" + $scope.userId,
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: $scope.user
            }).then( /* success */ function (response) {
                $scope.gotResponse = true;
                $scope.responseText = "User updated successfully";
                $timeout(function () {
                    $location.path("/admin");
                }, 3000)
            }, /* failure */ function (response) {
                $scope.gotResponse = true;
                $scope.responseText = "There has been an error updating the user. Please try again later";
                $timeout(function () {
                    $location.path("/admin");
                }, 3000);
            });
        };
	}

]);
