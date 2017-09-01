var app = angular.module('airbnbApp');

app.controller('adminCtrl', ['$scope', '$http', '$cookies',
	function ($scope, $http, $cookies) {
        console.log("Emitting showNav!");
        $scope.$broadcast('showNav', {
            showNav: false
        });
        
        var failureFunc = function(response) {
            if (response.status == 401) {
                $scope.loggedIn = false;
                $cookies.put(token, null);
            }
        };
        
        var token = $cookies.get('token');
        console.log("TOken = " + token);
        if (token != null && token != "") {
            $http({
                url: "http://localhost:8080/airbnb/rest/admin/verifytoken",
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                data: $cookies.get('token')
            }).then(/* success */ function(response) {
                $scope.loggedIn = true;
            }, /* failure */ failureFunc);
            $scope.loggedIn = true;
        } else {
            $scope.loggedIn = false;
        }
        
        $scope.signOut = function() {
            $cookies.put('token', null);
        };
        
        $scope.login = function () {
            var cred = {
                "email": $scope.username,
                "passwd": $scope.password
            };

            $http({
                url: "http://localhost:8080/airbnb/rest/user/login",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: cred
            }).then( /* success */ function (response) {
                $scope.loggedIn = true;
                $cookies.put("token", response.data.token);
            }, /* failure */ failureFunc);
        };

        $scope.export = function () {
            $http({
                url: "http://localhost:8080/airbnb/rest/admin/rawexport",
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                data: $cookies.get('token')
            }).then( /* success */ function (response) {
                $scope.xmlString = vkbeautify.xml(response.data);
                $scope.showUsers = false;
                $scope.showXml = true;
            }, /* failure */ failureFunc);
        };

        $scope.getApproval = function() {
            $http({
                url: "http://localhost:8080/airbnb/rest/admin/getapprovelist",
                method: "POST",
                data: $cookies.get('token'),
                headers: {
                    "Content-Type": "text/plain"
                }
            }).then(/* success */ function(response) {
                $scope.users = response.data;
            }, /* failure */ failureFunc); 
        };

        $scope.getUsers = function () {
            $http({
                url: "http://localhost:8080/airbnb/rest/admin/getusers",
                method: "POST",
                data: $cookies.get("token"),
                headers: {
                    "Content-Type": "text/plain"
                }
            }).then( /* success */ function (response) {
                $scope.users = response.data;
                console.log($scope.users);
                $scope.showUsers = true;
            }, /* failure */ failureFunc);
        };
}]);
