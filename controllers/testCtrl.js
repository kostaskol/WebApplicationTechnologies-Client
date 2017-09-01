var app = angular.module("airbnbApp");

app.controller("testCtrl", ['$scope', '$http', function($scope, $http) {
    var parseableDate;
    var date = new Date();
    parseableDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() +
                    " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    
    console.log(parseableDate);
    /* 
    d.getUTCFullYear() === date.getUTCFullYear() && 
                                d.getUTCMonth() === date.getUTCMonth() && 
                                d.getDate() === date.getDate()) {
                                return {
                                    disabled: true
                                };
    */
    $http({
        url: SERVER_URL + "/test/datetester",
        method: "POST",
        data: parseableDate
    });
    
    $scope.initialPages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    $scope.pages = ["<", 1, 2, 3, ">"];

    var MAX_SHOWN = 3;
    $scope.maxShown = 3;
    $scope.lastIndex = null;
    $scope.switched = 0;
    $scope.changePage = function(index) {
        if (index === 0) {
            if ($scope.switched === 0) return;
            $scope.switched--;

            var tmp = ["<"];
            for (var i = $scope.switched * MAX_SHOWN; i < ($scope.switched + 1) * MAX_SHOWN; i++) {
                tmp.push($scope.initialPages[i]);
            }
            tmp.push(">");
            $scope.pages = tmp;
            $scope.lastIndex = $scope.lastIndex + MAX_SHOWN;
        } else if (index === MAX_SHOWN + 1) {

            if (($scope.switched + 1) * MAX_SHOWN === $scope.initialPages.length) return;
            $scope.switched++;
            var tmp = ["<"];
            var max = MAX_SHOWN * $scope.switched + MAX_SHOWN < $scope.initialPages.length ? MAX_SHOWN * $scope.switched + MAX_SHOWN : $scope.initialPages.length;
            for (var i = $scope.switched * MAX_SHOWN; i < max; i++) {
                tmp.push($scope.initialPages[i]);
            }
            tmp.push(">");
            $scope.pages = tmp;
        } else {
            if (index === $scope.lastIndex) return;
            if ($scope.lastIndex !== null) {
                angular.element("#" + $scope.lastIndex).removeClass("selected");
            }
            angular.element("#" + index).addClass("selected");
            $scope.lastIndex = index;
        }
    }
}]);
