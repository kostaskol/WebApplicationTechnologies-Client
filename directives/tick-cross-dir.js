var app = angular.module('airbnbApp');

app.directive('tick', function() {
    return {
        restrict: 'E',
        template: "<img src=\"../pics/tick.png\" style=\"width: 15px; height: 15px;\"/>"
    }
})

app.directive('cross', function() {
    return {
        restrict: 'E',
        template: "<img src=\"../pics/cross.png\" style=\"width: 15px; height: 15px;\"/>"
    }
})