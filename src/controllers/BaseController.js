app.controller('BaseController', ['$scope', '$location', '$interval', 'sessionService', 'WdHttpService',
    function($scope, $location, $interval, sessionService, WdHttpService) {
        $scope.isLogin = true;
        $scope.isLogout = false;

        var refreshToken = sessionService.get("refresh");
        if (!sessionService.get('id')) {
            $scope.isLogin = true;
            $scope.isLogout = false;
        } else {
            $scope.isLogin = false;
            $scope.isLogout = true;
        }
        $scope.logOut = function() {
            sessionService.remove('refresh');
            sessionService.remove('auth');
            sessionService.remove('id');
            sessionService.remove('name');
            sessionService.remove('username');
            sessionService.remove('expiresIn');
            sessionService.remove('mode');
        }
        $scope.homeClick = function() {
            $location.path("/");
        }

        $scope.showPageLoader = function() {
            console.log('page loader shown now');
            $('#pageLoader').show();
            $('#pageLoader > div').show();
            $('#pageLoader > p').show();
        }

        $scope.hidePageLoader = function() {
            console.log('page loader hides now');
            $('#pageLoader').hide();
            $('#pageLoader > div').hide();
            $('#pageLoader > p').hide();
        }

        $scope.showErrorPopup = function(error, callback = undefined) {
            if (typeof error == 'string')
                $scope.errorHandleMessage = error;
            else
                $scope.errorHandleMessage = "Sorry! something went wrong, please try after sometime.";
            $('#somethingWrong').modal('show');
            $scope.apply();

            if (callback) {
                callback();
            }
        }

        $('[data-toggle="tooltip"]').tooltip();

        $interval(function() {
            $scope.refresh();
        }, 3300000);

        $scope.refresh = function() {
            if (refreshToken != undefined || refreshToken != null) {
                var data = { refreshToken: refreshToken };
                WdHttpService._refresh_token(data).then(function(response) {
                    sessionService.set("id", JSON.stringify(response.data.authenticationResult.idToken));
                    sessionService.set("auth", JSON.stringify(response.data.authenticationResult.accessToken));
                    var expireIn = parseInt(response.data.authenticationResult.expiresIn) * 1000 + parseInt(new Date().getTime());
                    sessionService.set("expiresIn", expireIn + "");
                });
            }
        };

    }
]);