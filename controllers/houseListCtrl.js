var app = angular.module('airbnbApp');

app.controller('houseListCtrl', ['$scope', '$location',
                                 function ($scope, $location) {
    $scope.presentHouse = function (parentIndex, index) {
        var actualIndex = parentIndex * 4 + index;
        $location.path('/house-pres').search({
            houseId: $scope.houses[actualIndex].houseId
        });
    };
}]);
