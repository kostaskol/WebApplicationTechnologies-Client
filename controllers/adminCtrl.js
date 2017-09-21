var app = angular.module('airbnbApp');

app.controller('adminCtrl', ['$scope', '$http', '$cookies', 'HttpCall',
	function ($scope, $http, $cookies, HttpCall) {
        $scope.exportBtnText = "Export to XML";
        $scope.$broadcast('showNav', {
            showNav: false
        });
        
        var token = $cookies.get('token');
        if (token !== null && token !== "") {
            var verifySuccess = function(response) {
                $scope.loggedIn = true;
            };
            
            var verifyFailure = function(response) {
                alert("Wrong credentials");
            };

            HttpCall.post("admin/verifytoken", $cookies.get("token"), "text/plain", verifySuccess, verifyFailure);
        } else {
            $scope.loggedIn = false;
        }
        
        $scope.signOut = function() {
            $cookies.put('token', null);
        };
        
        $scope.login = function () {
            var data = {
                "mail": $scope.username,
                "passwd": $scope.password
            };

            var loginSuccess = function(response) {
                $scope.loggedIn = true;
                $cookies.put("token", response.data);
                console.log("Got response: " + response.data);
            };

            HttpCall.post("admin/login", data, "application/json", loginSuccess, generalFailure);
        };

        $scope.export = function () {
            $scope.exportBtnText = "Please wait...";
            var exportSuccess = function(response) {    
                /*
                    The export request creates the XML file for export and sends
                    a token that is valid for N TODO: Change this! seconds.
                    The client then sends a GET request with that token as a query parameter
                    and downloads the file through the browser
                 */

                var url = SERVER_URL + "/admin/getxml?t=" + response.data;
                window.open(url, "_blank");
                window.focus();
                $scope.showUsers = false;
                $scope.exportBtnText = "Export to XML";
            };
            
            
            var exportFailure = function(response) {
                $scope.exportBtnText = "Export to XML";
                console.log("Got failure response: " + JSON.stringify(response));
            }
            HttpCall.postText("admin/rawexport", $cookies.get("token"), exportSuccess, exportFailure);
        };

        $scope.getApproval = function() {
            HttpCall.postText("admin/getapprovelist", token, function(response) {
                $scope.users = response.data;
            }, generalFailure);
        };

        $scope.getUsers = function () {
            var getUsersSucess = function(response) {
                $scope.users = response.data;
                console.log($scope.users);
                $scope.showUsers = true;
            };

            HttpCall.postText("admin/getusers", token, getUsersSucess, generalFailure);
        };
}]);
