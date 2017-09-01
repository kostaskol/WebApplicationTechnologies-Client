var app = angular.module('airbnbApp');

app.controller('profilePageCtrl', ['$scope', '$routeParams', '$location',
	function($scope, $routeParams, $location) {
		$scope.userId = parseInt($routeParams.userId);
		$scope.user = getUser($scope.userId);

		$scope.message = function() {
			$location.path("/message").search({
				userId: $scope.userId
			}); 
		}
}]);