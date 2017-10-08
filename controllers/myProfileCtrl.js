var app = angular.module('airbnbApp');

app.controller('myProfileCtrl', ['$scope', '$location', '$cookies', 'HttpCall', '$rootScope',
    function ($scope, $location, $cookies, HttpCall, $rootScope) {
    var data = {
        token: $cookies.get('token')
    };

    $scope.mailChanged = false;
    $scope.type = 'mp';

    if ($cookies.get("loggedIn") === "false" || $cookies.get("token") === "" || $cookies.get("token") === null) {
        $location.path("/");
    }

    $scope.updateUser = function () {
        if ($scope.initialBio != $scope.user.bio ||
            $scope.initialPNum != $scope.user.pNum) {
            var data = {
                bio: $scope.user.bio,
                pNum: $scope.user.pNum,
                token: $cookies.get("token")
            };

            var updateSuccess = function(response) {
                $scope.initialBio = $scope.user.bio;
            };

            HttpCall.postJson("user/updateuser", data, updateSuccess, generalFailure);
        }
    };

    $scope.getUser = function() {
        var getSuccess = function(response) {
            $scope.user = response.data;
            $scope.initialBio = response.data.bio;
            $scope.initialPNum = response.data.pNum;
            console.log(response.data);
            if ($scope.user.accType.charAt(RENTER_OFFS) === "1") {
                $scope.renter = true;
                if ($scope.user.approved) {
                    $scope.approvedText = "You can register houses";
                } else {
                    $scope.approvedText = "Your request for house registration is under review. Please check back later";
                }
            } else {
                $scope.renter = false;
            }
        };

        var getFailure = function(response) {
            $scope.$apply(function() {
                $location.path("/");
            });
        };

        HttpCall.postJson("user/getuser", data, getSuccess, getFailure);
    };

    $scope.getUser();


    $scope.showMessages = function (type) {
        var messageSuccess = function(response) {
            if (response.data.length === 0) {
                $scope.noMessages = true;
            } else {
                $scope.messages = response.data;
                console.log(JSON.stringify($scope.messages));
                $scope.noMessages = false;
            }
            if (type == 0) {
                $scope.type = 'mmi';
            } else {
                $scope.type = 'mms';
            }
        };

        HttpCall.postText("message/receive/" + type, $cookies.get("token"), messageSuccess, generalFailure);
    };

    $scope.previousIndex = null;
    $scope.shown = false;
    $scope.showMessage = function (index) {
        if ($scope.previousIndex !== null) {
            angular.element("#" + $scope.previousIndex + "-body").removeClass("shown");
            angular.element("#" + $scope.previousIndex + "-body").addClass("hide");
        }

        if ($scope.previousIndex === index) {
            if ($scope.shown) {
                angular.element("#" + $scope.previousIndex + "-body").removeClass("shown");
                angular.element("#" + $scope.previousIndex + "-body").addClass("hide");
                $scope.shown = false;
            } else {
                angular.element("#" + $scope.previousIndex + "-body").removeClass("hide");
                angular.element("#" + $scope.previousIndex + "-body").addClass("shown");
                $scope.shown = true;
            }
            return;
        }

        $scope.previousIndex = index;
        angular.element("#" + index + "-body").removeClass("hide");
        angular.element("#" + index + "-body").addClass("shown");
        $scope.shown = true;
    };

    $scope.signOut = function () {
        swal({
            title: "Warning",
            text: "Are you sure you wish to sign out?",
            allowOutsideClick: true,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "Sign out",
            cancelButtonText: "No, take me back"
        }, function (confirmed) {
            if (confirmed) {
                var signOutSuccess = function(response) {
                    $cookies.put("token", "");
                    $cookies.put("loggedIn", "false");
                    $rootScope.$emit("UpdateNavBar", {});
                    $location.path("/home");
                };
                HttpCall.postText("user/invalidate", $cookies.get("token"), signOutSuccess, generalFailure);
            }
        });

    };
    
    $scope.showHouses = function() {
        $scope.type = "sh";
        var housesMinSuccess = function(response) {
            $scope.usersHouses = response.data;
            $scope.houseListStyle = {
                "margin-left": "15%"
            };
        };

        HttpCall.postText("house/getusershousesmin", $cookies.get("token"), housesMinSuccess, generalFailure);
    };

    $scope.updateProfilePic = function() {
        document.getElementById("newProfilePicture").click();
    };

    $scope.fileSelected = function(files) {
        var file = files[0];
        var fd = new FormData();
        fd.append("file", file);
        fd.append("token", $cookies.get("token"));
        var uploadSuccess = function(response) {
            $scope.getUser();
            $rootScope.$emit("UpdateNavBar", {});
        };

        HttpCall.post("user/updateprofilepicture", fd, undefined, uploadSuccess, generalFailure);
    };


    $scope.deleteMessage = function (index) {
        swal({
                title: "Warning",
                text: "Are you sure you want to delete this message?",
                type: "warning",
                allowOutsideClick: true,
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "I'm sure",
                cancelButtonText: "No, take me back",
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function (confirmed) {
                if (confirmed) {
                    var successFunction = function(response) {
                        $scope.messages.splice(index, 1);
                        swal({
                            title: "Success!",
                            text: "The message has been successfully deleted",
                            type: "success"
                        });
                    };
                    HttpCall.postText("message/delete", $cookies.get("token"), successFunction, generalFailure);
                }
            });
    };

    var getBookings = function (response) {
        if (response.data.length === 0) {
            $scope.noBookings = true;
        }
        $scope.bookings = response.data;
        $scope.currentlyBooked = [];
        $scope.previouslyBooked = [];
        for (var i = 0; i < $scope.bookings.length; i++) {
            if (new Date($scope.bookings[i].dateTo) < new Date()) {
                $scope.previouslyBooked.push($scope.bookings[i]);
                $scope.hasPrevious = true;
            } else {
                $scope.currentlyBooked.push($scope.bookings[i]);
                $scope.hasCurrent = true;
            }
        }
    };

    $scope.showBooked = function (type) {
        $scope.hasCurrent = $scope.hasPrevious = false;

        var token = $cookies.get("token");
        var url;
        if (type === 0) {
            url = "booking/getusersbookings";
        } else {
            url = "booking/getrentersbookings";
        }

        HttpCall.postText(url, token, getBookings, generalFailure);
        $scope.type = 'bookings';
    };

    $scope.showMessage(0);

    $scope.reply = function(type, index) {
        var userId;
        if (type == 0) {
            userId = $scope.messages[index].senderId;
        } else {
            userId = $scope.messages[index].receiverId;
        }
        $location.path("/message").search({
            userId: userId
        });
    };


    $scope.showProfile = function () {
        $scope.type = "mp";
    };

    $scope.changeEmail = function () {
        $scope.showMail = !$scope.showMail;
    };

    $scope.updateMail = function () {
        if ($scope.newMail === "" || $scope.newMail === null) {
            console.log("Returning")
            return;
        }

        var data = {
            token: $cookies.get("token"),
            newMail: $scope.newMail
        };

        var updateMailSuccess = function(response) {
            $scope.mailChanged = true;
        };

        HttpCall.postJson("user/changemail", data, updateMailSuccess, generalFailure);
    };
}]);
