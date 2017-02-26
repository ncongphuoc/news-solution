/**
 * Created by nhanva on 4/19/2016.
 */
(function (define, angular) {
    define(['angular'], function (angular) {
        return angular.module('app.session', ['ngCookies'])
            .service('Session', function ($rootScope, $cookies, $window) {
                var _parent = this;
                this.changeSupportUser = function (_user) {
                    this.supportUser = _user;
                    $window.sessionStorage[getSupportKey()] = JSON.stringify(_user);
                }
                this.create = function (user) {
                    this.user = user;
                    // Set the browser session, to avoid relogin on refresh
                    //$cookies.put("userInfo", JSON.stringify(user));
                };
                this.destroy = function () {
                    this.user = null;
                    this.supportUser = null;
                    // Clear session info
                    $cookies.remove("userInfo", {domain: location.hostname.split('.').slice(-2).join('.'), path: '/'});
                    $window.sessionStorage.removeItem(getSupportKey());
                };

                var getSupportKey = function(){
                    return "ADX.persistent.su." + (_parent.user && _parent.user.user_id ? _parent.user.user_id : 0);
                }

                return this;
            })
            .service('Storage', function ($rootScope, $window, Session) {
                var self = this;
                this.PREFIX = 'ADX.' + (DATA_VERSION || 20160701) + '.' + (Session.user && Session.user.user_id ? Session.user.user_id : 0) + '.';
                // Read value from local storage
                this.read = function (key) {
                    key = this.PREFIX + key;
                    // Read value from local storage
                    var value = $window.localStorage.getItem(key);

                    // Parse value and return
                    return value ? angular.fromJson( value ) : null;
                }

                // Write value to local storage
                this.write = function (key, value) {
                    //console.log('Write local store read', key)
                    // Add prefix
                    key = this.PREFIX + key;
                    return $window.localStorage.setItem(key, angular.toJson(value));
                }

                // Delete storage was out update
                this.clean = function () {
                    console.log('Storage clean up staring...')
                    // Get all key from local storage
                    Object.keys($window.localStorage).forEach(function (key) {
                        // Remove out update key
                        if(key.indexOf(self.PREFIX) == -1){
                            $window.localStorage.removeItem(key)
                        }
                    });
                }

                // Delete all local storage
                this.reset = function () {
                    $window.localStorage.clear();
                }

                return this;
            })
            .service('PrivateStorage', function ($rootScope, $window, Session) {
                this.PREFIX = 'ADX.' + (DATA_VERSION || 20160701) + '.' + (Session.user && Session.user.user_id ? Session.user.user_id : 0) + '.';
                // Read value from local storage
                this.read = function (key) {
                    key = this.PREFIX + key;
                    // Read value from session storage
                    var value = $window.sessionStorage.getItem(key);

                    // Parse value and return
                    return value ? angular.fromJson( value ) : null;
                }

                // Write value to local storage
                this.write = function (key, value) {
                    //console.log('Write local store read', key)
                    // Add prefix
                    key = this.PREFIX + key;
                    return $window.sessionStorage.setItem(key, angular.toJson(value));
                }

                // Delete storage was out update
                this.clean = function () {
                    // Do nothing
                }

                return this;
            })
    })
}
(define, angular));