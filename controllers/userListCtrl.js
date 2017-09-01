var app = angular.module('airbnbApp');

app.controller('userListCtrl', ['$scope', '$location', '$http', '$cookies',
		function ($scope, $location, $http, $cookies) {
        console.log($scope.users);
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
            console.log("Token = " + $cookies.get('token'));
            console.log("Index = " + index + " userId = " + userId);
            $http({
                url: "http://localhost:8080/airbnb/rest/admin/approve/" + userId,
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                data: $cookies.get('token')
            }).then( /* success */ function (response) {
                $scope.users[index].approved = true;
            }, /* failure */ function (response) {
                window.alert("There has been some error approving that user");
            });
        };
}]);
