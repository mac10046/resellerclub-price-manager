app.controller('BaseController', ['$scope', '$location', 'sessionService',
    function($scope, $location, sessionService) {

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
    }
]);