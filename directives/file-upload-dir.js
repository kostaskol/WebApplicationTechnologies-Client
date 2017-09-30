var app = angular.module('airbnbApp');

// This directive was copied from somewhere on https://www.stackoverflow.com (can't remember the exact URL)
app.directive('fileModel', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function() {
        scope.$apply(function() {
          modelSetter(scope, element[0].files[0]);
        })
      })
    }
  }
}]);
