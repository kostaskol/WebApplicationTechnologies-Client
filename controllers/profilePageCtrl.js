var app = angular.module('airbnbApp');

app.controller('profilePageCtrl', ['$scope', '$routeParams', '$location', '$http', '$cookies',
	function($scope, $routeParams, $location, $http, $cookies) {

        $scope.loggedIn = $cookies.get("loggedIn") === "true";
        var userId = $routeParams.userId;
        var url = SERVER_URL + "/user/getuser/" + userId;
		$http({
            url: url,
            method: "GET"
        }).then(/* success */ function(response) {
            $scope.user = response.data;
            $scope.user.firstName = capitalizeFirst($scope.user.firstName);
            $scope.user.lastName = capitalizeFirst($scope.user.lastName);
        }, /* failure */ function(response) {

        });
		$scope.message = function() {
			$location.path("/message").search({
				userId: $scope.userId
			}); 
		}
}]);