var app = angular.module('airbnbApp');

app.directive('houseList', function() {
    return {
        restrict: 'E',
        scope: {
            houses: '=',
            houseListStyle: '='
        },
        templateUrl: "views/house-list.html",
        controller: 'houseListCtrl'
    };
});