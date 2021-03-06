var app = angular.module("airbnbApp");

app.directive("bookingList", ['$location', function ($location) {
    return {
        restrict: "E",
        scope: {
            bookings: "=",
            houseListStyle: "="
        },
        templateUrl: "views/booking-list.html",
        link: function (scope, element, attributes) {
            console.log(scope.bookings[0]);
            console.log(scope.houseListStyle);
            scope.presentHouse = function (parentIndex, index) {
                var actualIndex = parentIndex * 4 + index;
                $location.path('/house-pres').search({
                    houseId: scope.bookings[actualIndex].house.houseId
                });
            };
        }
    };
}]);
