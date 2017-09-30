var app = angular.module('airbnbApp');

app.controller('messageCtrl', ['$scope', 'HttpCall', '$cookies', '$routeParams', '$timeout', '$location',
    function($scope, HttpCall, $cookies, $routeParams, $timeout, $location) {
        $scope.messageSent = false;
        $scope.message = "";
        $scope.subject = "";

        $scope.send = function() {
            console.log("Sending message");
            if ($scope.message == null || $scope.message == "") return;
            if ($scope.subject == null || $scope.subject == "") return;
            console.log("Passed empty check");

            var token = $cookies.get("token");
            if (token === null || token === "") {
                $location.path("/login");
            }

            var data = {
                token: $cookies.get('token'),
                subject: $scope.subject,
                message: $scope.message
            };

            var success = function(response) {
                $timeout(function() {
                    window.history.back();
                }, 3000);
                $scope.messageSent = true;
                $scope.statusMessage = "Your message was successfully sent";
            };

            var failure = function(response) {
                $scope.messageSent = true;
                $scope.statusMessage = "There has been a problem sending your message. Please try again later";
            };


            HttpCall.postJson("message/send/" + $routeParams.userId, data, success, failure);
        }
    }
]);
