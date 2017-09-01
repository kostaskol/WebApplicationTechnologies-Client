var app = angular.module('airbnbApp');

app.directive('quantPicker', function() {
	return {
		restrict: 'E',
		scope: {
			moreFunc: '=',
			lessFunc: '=',
			item: '=',
			num: '='
		},
		templateUrl: 'views/quantPicker.html',
		link: function(scope, element, attrs) {
			scope.more = function() {
				scope.moreFunc(scope.num);
			}

			scope.less = function() {
				scope.lessFunc(scope.num);
			}
		}
	}
});