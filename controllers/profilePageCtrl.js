var app = angular.module('airbnbApp');

app.controller('profilePageCtrl', ['$scope', '$routeParams', '$location', 'HttpCall', '$cookies',
	function($scope, $routeParams, $location, HttpCall, $cookies) {

        $scope.loggedIn = $cookies.get("loggedIn") === "true";
        var userId = $routeParams.userId;
        var url = SERVER_URL + "/user/getuser/" + userId;
        var success = function(response) {
            $scope.user = response.data;
            $scope.user.firstName = capitalizeFirst($scope.user.firstName);
            $scope.user.lastName = capitalizeFirst($scope.user.lastName);
        };
        
        HttpCall.get("user/getuser/" + userId, success, generalFailure);

		$scope.message = function() {
			$location.path("/message").search({
				userId: $scope.userId
			}); 
		}
}]);