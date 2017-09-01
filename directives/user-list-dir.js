var app = angular.module('airbnbApp');

app.directive('userList', function() {
	return {
		restrict: 'E',
		scope: {
			users: '='
		},
		templateUrl: 'views/user-list.html',
		controller: 'userListCtrl'
	}
});