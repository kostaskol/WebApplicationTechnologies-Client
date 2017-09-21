var app = angular.module('airbnbApp');

app.controller('loginCtrl', ['$scope', '$location', '$rootScope', '$cookies', 'HttpCall',
    function ($scope, $location, $rootScope, $cookies, HttpCall) {
        $scope.logMail = "kwstaskolivas@gmail.com";
        $scope.logPasswd = "4917847";
        $scope.login = function () {
            var credentials = {
                "email": $scope.logMail,
                "passwd": $scope.logPasswd
            };

            var succCb = function (response) {
                var data = response['data'];
                console.log("Token: " + data.token);
                $cookies.put('token', data.token, {
                    path: "/"
                });
                $cookies.put("loggedIn", "true", {
                    path: "/"
                });
                console.log("$cookies.token = " + $cookies.get('token'));
                $rootScope.$emit('UpdateNavBar', {});
                window.history.back();
            };

            HttpCall.postJson("user/login", credentials, succCb, generalFailure);
        };
        
        $scope.resetPass = function() {
            window.alert("Just input 3452")
            $location.path("/passreset");
        }


}])
