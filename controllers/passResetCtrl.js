var app = angular.module('airbnbApp');

app.controller('passResetCtrl', ['$scope', 'HttpCall', '$location',
                                 function($scope, HttpCall, $location) {
    $scope.reset = function() { 
        if ($scope.secCode !== 3452) {
            window.alert("Wrong security code (3452)");
            return;
        }
        
        var data = {
            email: $scope.email,
            password: $scope.pass
        };



        var resetSuccess = function(response) {
            $location.path("/login")
        };

        var resetFailure = function(response) {
            window.alert("There has been an error");
        };

        HttpCall.postJson("user/passreset", data, resetSuccess, failure);
    }
}]);