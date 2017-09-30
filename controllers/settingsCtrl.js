var app = angular.module('airbnbApp');

app.controller('settingsCtrl', ['$scope', 'HttpCall', '$cookies',
                                function ($scope, HttpCall, $cookies) {
        $scope.uploadFile = function () {
            if ($scope.myFile == null) {
                return;
            }
            var file = $scope.myFile;
            var fd = new FormData();
            fd.append('file', file);

            var tok = $cookies.get('token');
            fd.append('token', tok);
            console.log(JSON.stringify(tok));

            $http({
                url: "http://localhost:8080/airbnb/rest/profilecontrol/upload",
                method: "POST",
                headers: {
                    "Content-Type": undefined
                },
                data: fd
            }).then( /* success */ function (data) {
                console.log("Successfully uploaded image: " + JSON.stringify(data));
            }, /* failure */ function (data) {
                console.log("Failure to upload image: " + JSON.stringify(data))
            })
        }
}]);
