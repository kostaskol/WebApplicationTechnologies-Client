angular.module('airbnbApp').controller('houseEditListCtrl', ['$scope', '$location',
    function ($scope, $location) {
        $scope.presentHouse = function (parentIndex, index) {
            var actualIndex = parentIndex * 4 + index;
            $location.path('/house-edit').search({
                houseId: $scope.houses[actualIndex].houseId
            });
        };
    }]);
