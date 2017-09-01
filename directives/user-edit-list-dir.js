var app = angular.module("airbnbApp");

app.directive("userEditList", ['$location', function ($location) {
    return {
        restrict: "E",
        templateUrl: "views/user-edit-list.html",
        scope: {
            houses: "="
        },
        link: function (scope, element, attributes) {
            scope.presentHouse = function (parentIndex, index) {
                var actualIndex = parentIndex * 4 + index;
                $location.path('/house-edit').search({
                    houseId: scope.houses[actualIndex].houseId
                });
            };
        }
    };
}]);
