app.factory('sessionService', [function() {

    var wdhash = 'tgb@@nljyuhsdherr';

    return {
        set: function(key, value) {
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            var encryptedData = CryptoJS.AES.encrypt(value, wdhash);
            return localStorage.setItem('wd_' + key, encryptedData);
        },
        get: function(key) {
            var encryptedData = localStorage.getItem('wd_' + key);
            if (encryptedData != null) {
                var value = CryptoJS.AES.decrypt(encryptedData, wdhash).toString(CryptoJS.enc.Utf8);
                try {
                    value = JSON.parse(value);
                } catch (error) {
                    if (value.startsWith('"') && value.endsWith('"'))
                        return value.slice(1, -1);
                }
                return value;
            }
            return null;
        },
        remove: function(key) {
            return localStorage.removeItem('wd_' + key);
        },
        isLoggedIn: function() {
            if (parseInt(this.get('expiresIn'))) {
                return (parseInt(this.get('expiresIn')) > new Date().getTime());
            } else {
                return false
            }
        }
    }
}]);

app.factory('HttpService', ['$http', '$location', 'config', '$q', 'sessionService',
    function($http, $location, config, $q, sessionService) {

        function removeSession() {
            sessionService.remove('auth');
            sessionService.remove('id');
            sessionService.remove('refresh');
            sessionService.remove('username');
            sessionService.remove('expiresIn');
            sessionService.remove('mode');
        }

        function common_api_error_handler(error) {
            if (error.status == "401" || error.data.message == "The incoming token has expired") {
                removeSession(sessionService);
                $location.path('/login');
                return true;
            } else if (error.data.message == 'Unauthorised') {
                removeSession(sessionService);
                $location.path('/login');
                return true;
            } else if (error.status.toString().match('5\d{2}')) {
                return true;
            }
            return false;
        }

        function returnError(error) {
            try {
                if (common_api_error_handler(error))
                    return 'Sorry something went wrong';
                if (error.data.message) {
                    return error.data.message;
                } else if (error.data.reason) {
                    return error.data.reason;
                } else if (error.data.errorMessage) {
                    return error.data.errorMessage;
                } else {
                    return error;
                }
            } catch (error) {
                return 'Something went wrong, try again after some time.';
            }
        }
        var obj = { // Public Methods exposed for Controllers to use.
            _api_function: function(data) {
                var defer = $q.defer();
                prepareHttpCall($http, true);
                $http.post(config.API_ROOT + 'url-path', data)
                    .then(function(response) {
                        defer.resolve(response);
                    }).catch(function(error) {
                        defer.reject(returnError(error));
                    });
                return defer.promise;
            }
        }

        function prepareHttpCall($http, isEndpointAuthenticated) {
            if (isEndpointAuthenticated) {
                $http.defaults.headers.common['Authorization'] = sessionService.get("id");
            } else {
                $http.defaults.headers.common['Authorization'] = undefined;
            }
            $http.defaults.headers.common['x-api-key'] = config.API_KEY;
            $http.defaults.headers.common['Content-Type'] = config.CONTENT_TYPE;
        }

        return obj;

    }
]);