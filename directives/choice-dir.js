var app = angular.module('airbnbApp');

app.directive('choice', function() {
    return {
        restrict: 'E',
        scope: {
            item: '='
        },
        templateUrl: "views/choice.html"
    }
})