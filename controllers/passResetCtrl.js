var app = angular.module('airbnbApp');

app.controller('passResetCtrl', ['$scope', '$http', '$location',
                                 function($scope, $http, $location) {
    $scope.reset = function() { 
        if ($scope.secCode != 3452) {
            window.alert("Wrong security code (3452)");
            return;
        }
        
        // TODO: Insert form checking here 
        // 1. Make the signup form's checking methods a service
        // 2. Inject service here
        // 3. ???
        // 4. Profits
        
        var data = {
            email: $scope.email,
            password: $scope.pass
        };
        
        console.log(data);
        
        $http({
            url: "http://localhost:8080/airbnb/rest/user/passreset",
            method: "POST",
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(/* success */ function(response) {
            $location.path("/login")
        }, /* failure */ function(response) {
            window.alert("There has been an error");
        })
    }
}]);