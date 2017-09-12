var app = angular.module('airbnbApp');

app.controller('loginCtrl', ['authenticationService', '$scope', '$location', '$rootScope', '$cookies',
    function (authenticationService, $scope, $location, $rootScope, $cookies) {
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
                console.log("$cookies.token = " + $cookies.get('token'));
                $rootScope.$emit('UpdateNavBar', {});
                window.history.back();
            };

            var failCb = function (response) {
                var data = response['data'];
                console.log(JSON.stringify(data));
            };

            authenticationService.login(credentials, succCb, failCb);
        };
        
        $scope.resetPass = function() {
            window.alert("Just input 3452")
            $location.path("/passreset");
        }


}])
