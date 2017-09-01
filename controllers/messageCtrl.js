var app = angular.module('airbnbApp');

app.controller('messageCtrl', ['$scope', '$http', '$cookies', '$routeParams', '$timeout', '$location',
    function($scope, $http, $cookies, $routeParams, $timeout, $location) {
        $scope.messageSent = false;
        $scope.message = "";
        $scope.subject = "";

        $scope.send = function() {
            console.log("Sending message");
            if ($scope.message == null || $scope.message == "") return;
            if ($scope.subject == null || $scope.subject == "") return;
            console.log("Passed empty check");

            var token = $cookies.get("token");
            if (token == null || token == "") {
                $location.path("/login");
            }
            var data = {
                token: $cookies.get('token'),
                subject: $scope.subject,
                message: $scope.message
            }

            console.log("Sending: " + JSON.stringify(data));
            $http({
                url: SERVER_URL + "/message/send/" + $routeParams.userId,
                method: "POST",
                data: data
            }).then( /* success */ function(response) {
                $timeout(function() {
                    window.history.back();
                }, 3000);
                $scope.messageSent = true;
                $scope.statusMessage = "Your message was successfully sent";
            }, /* failure */ function(response) {
                console.log(response);
                $scope.messageSent = true;
                $scope.statusMessage = "There has been a problem sending your message. Please try again later";
                // $timeout(function() {
                //     window.history.back();
                // }, 3000);
            })

        }
    }
]);
