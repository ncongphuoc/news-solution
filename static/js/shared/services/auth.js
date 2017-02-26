/**
 * Created by nhanva on 4/19/2016.
 */
(function (define, angular) {
    define(['angular'], function (angular) {
        return angular.module('app.auth', ['ngCookies', 'app.session'])
            .factory('Auth', function ($http, $rootScope, $window, Session, AUTH_EVENTS, appConfig, $cookies) {
                var LOGIN_URL = '/buyer/authenticate';
                var authService = {};

                //the login function
                authService.login = function (user, success, error) {


                    var loginData = {"user_id":"1210044026","full_name":"Nguyen Luong Nghia Dev","avatar":"","role":"2","conversion_id":"5d7ddd4f","token":"s2o2w234b4u4x24464o2t2s2y2t2x2v266v2a4x2d4745464q2w203t4b4a434w2h5z2t2i534d4c4w26444y294k5r20324n5s2t2u284x2z264a4138454"};
                    Session.create(loginData);
                    // Fire event of successful login
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, {user: loginData});
                    success(loginData);



                    /*$http.post(appConfig.API +  LOGIN_URL, angular.extend({}, user, {app_id: appConfig.APP_ID})).success(function (response) {
                        // Get response from server
                        var users = response.users;
                        if (response.code == 200) {
                            // Login data in format {'user_name': 'nhanva@ants.vn', 'full_name': 'nhanva', 'token': 'my_token', role: 1};
                            // Role == 1 -> Support account, Role == 2 --> Buyer account
                            var loginData = response.data.personal;
                            loginData.token = response.data.token;

                            if(response && response.data && !response.data.G2FA){
                                //update current user into the Session service or $rootScope.currentUser
                                Session.create(loginData);

                                // Fire event of successful login
                                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, {user: loginData});
                            }else{
                                $rootScope.$broadcast(AUTH_EVENTS.verify2Step, {user: loginData});
                            }

                            // Run success function
                            success(loginData);
                        } else {
                            // Unsuccessful login, fire login failed event for the according functions to run
                            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);

                            // Run error function
                            error(response);
                        }

                    });*/


                };

                //check if the user is authenticated
                authService.isAuthenticated = function () {
                    return !!Session.user;
                };

                //check if the user is authorized to access the next route
                //this function can be also used on element level
                //e.g. <p ng-if="isAuthorized(authorizedRoles)">show this only to admins</p>
                authService.isAuthorized = function (authorizedRoles) {
                    if (!angular.isArray(authorizedRoles)) {
                        authorizedRoles = [authorizedRoles];
                    }
                    return (authService.isAuthenticated() &&
                    authorizedRoles.indexOf(Session.userRole) !== -1);
                };

                //log out the user and broadcast the logoutSuccess event
                authService.logout = function () {
                    // TODO: Call api to delete token
                    Session.destroy();
                    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                }
                // Get support user
                authService.supportUser = function () {
                    if(typeof Session.user != 'undefined'){
                        var supportUser = Session.supportUser || Session.user || {};
                        angular.extend(supportUser, {roles:{read: false, write: false}})
                        return supportUser;
                    }else{
                        return {};
                    }

                }

                // Change support user
                authService.changeSupportUser = function (user) {
                    return Session.changeSupportUser(user);
                }

                // 	If a session exists for current user (page was refreshed) log him in again
                if (typeof $cookies.get("userInfo") != 'undefined') {
                    var loginData = JSON.parse($cookies.get("userInfo")), user_id = 0;
                    if (typeof loginData != 'undefined') {
                        $rootScope.currentUser = loginData;
                        Session.create(loginData)
                        user_id = loginData.user_id;
                    }



                    var key = 'ADX.persistent.su.' + user_id;
                    if(typeof $window.sessionStorage[key] != 'undefined' && $window.sessionStorage[key]){
                        var supportUser = JSON.parse($window.sessionStorage[key]);
                        if (typeof supportUser != 'undefined') {
                            Session.changeSupportUser(supportUser);
                        }

                    }
                }

                return authService;
            });
    })
}
(define, angular));