var app = angular.module('airbnbApp');

app.controller('userListCtrl', ['$scope', '$location', 'HttpCall', '$cookies',
		function ($scope, $location, HttpCall, $cookies) {
        $scope.showUser = function (index) {
            console.log("Showing user @ index" + index);
            console.log("User id = " + $scope.users[index].userId);
            console.log("User = " + JSON.stringify($scope.users));
            $location.path("/userpresentation").search({
                userId: $scope.users[index].userId
            });
        };

        $scope.approve = function (index) {
            var userId = $scope.users[index].userId;
            var success = function(response) {
                $scope.users[index].approved = true;
            };

            var failure = function(response) {
                window.alert("There has been some error approving the user\n(" + response.data + ")");
            };
            HttpCall.postText("admin/approve/" + userId, $cookies.get("token"), success, failure);
        };
}]);
