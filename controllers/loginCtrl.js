var app = angular.module('airbnbApp');

app.controller('loginCtrl', ['$scope', '$location', '$rootScope', '$cookies', 'HttpCall',
    function ($scope, $location, $rootScope, $cookies, HttpCall) {
        $scope.wrongCred = false;
        $scope.login = function () {
            var credentials = {
                "email": $scope.logMail,
                "passwd": $scope.logPasswd
            };

            console.log("Sending credentials: " + JSON.stringify(credentials));

            var succCb = function (response) {
                var token = response.data;
                console.log("Token: " + token);
                $cookies.put('token', token);
                $cookies.put("loggedIn", "true", {
                    path: "/"
                });
                $rootScope.$emit('UpdateNavBar', {});
                window.history.back();
            };

            var failure = function(response) {
                console.log("Failure response " + JSON.stringify(response.data));
                
                if (response.status == 401) {
                    $scope.wrongCred = true;
                }
            };

            HttpCall.postJson("user/login", credentials, succCb, failure);
        };
        
        $scope.resetPass = function() {
            window.alert("Just input 3452")
            $location.path("/passreset");
        };


}])
