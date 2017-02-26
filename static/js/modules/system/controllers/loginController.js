/**
 * Created by nhanva on 4/19/2016.
 */
define(['app'], function (app) {
    app.controller('systemLoginController',
        ['$scope', '$rootScope', 'Auth', '$state', 'appConfig', 'Session', 'AUTH_EVENTS', '$window',
            function ($scope, $rootScope, Auth, $state, appConfig, Session, AUTH_EVENTS, $window) {
                $scope.showLoading = true;
                $(window).on('message', function(e){

                    var loginInfo = angular.fromJson(e.originalEvent.data);

                    if(loginInfo.action == 'ogs-authenticate'){
                        var postData = {
                            token: loginInfo.token,
                            action: loginInfo.action,
                            conversion_id: loginInfo.conversion_id,
                            full_name: loginInfo.full_name,
                            role: loginInfo.role,
                            user_id: loginInfo.user_id
                        }
                        Session.create(postData);

                        // Fire event of successful login
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, {user: postData});

                        gotoPage();
                    }else if(loginInfo.action == 'ogs-loaded'){
                        $scope.showLoading = false;
                        $scope.$apply();
                    }

                })



                $scope.ST_HOST = appConfig.ST_HOST;
                $scope.AUTH_ADX_DOMAIN = appConfig.AUTH_ADX_DOMAIN;
                $scope.APP_ID = appConfig.APP_ID;
                // Variable
                $scope.processing = false;
                $scope.error = false;
                $scope.username = '';
                $scope.password = '';
                // Type of password
                $scope.passwordType = 'password';
                $scope.showValidate = false;
                $rootScope.showLoading = false;
                $scope.verifyG2fa = false; // Show two-factor authentication
                var _userInfo // Store tem user info before verify two step

                // PRIVATE FUNCTION
                // Go to page after login
                var gotoPage = function () {
                    /*
                    if (typeof $rootScope.returnToState != 'undefined' && $rootScope.returnToState != 'login') {
                        $state.go($rootScope.returnToState)
                    } else {
                        if(Session.user && Session.user.role == 1){
                            $state.go('accounts');
                        }else{
                            $state.go('buyer');
                        }

                    }
                    */
                    /*if(Session.user && Session.user.role == appConfig.USER_ROLES.SUPPORT){
                        //$state.go('accounts', {user_id: Auth.supportUser().user_id});
						$state.go('campaigns.lineitem', {user_id: Auth.supportUser().user_id});
                    }else{
                        $state.go('campaigns.lineitem', {user_id: Auth.supportUser().user_id});
                    }*/

                    if($rootScope.link_redirect != undefined && $rootScope.link_redirect != ''){
                        $window.location.href = $rootScope.link_redirect;
                    }else{
                        $state.go('operations.private-deal', {user_id: Auth.supportUser().user_id});
                    }
                }

                // User already login
                if (Auth.isAuthenticated()) {
                    // Go to previous page
                    gotoPage();
                }

                // Login action
                $scope.login = function () {
                    if ($scope.loginForm.$valid) {
                        $scope.processing = true;
                        Auth.login({user_name: $scope.username, password: $scope.password},
                            function (data) {
                                $rootScope._redirect = false;
                                // Login success
                                // Go to previous page after login
                                $scope.processing = false;

                                // Reset show error
                                $scope.error = false;
                                $scope.showValidate = false;

                                if(data && !data.G2FA){
                                    gotoPage();
                                }

                            },
                            function () {
                                $scope.processing = false;
                                $scope.error = true;
                                $scope.showValidate = false;
                            }
                        );
                    }else{
                        $scope.error = false;
                        $scope.showValidate = true;
                    }
                }
                // Show password
                $scope.showPassword = function () {
                    $scope.passwordType = 'text';
                }
                // Hide password
                $scope.hidePassword = function () {
                    $scope.passwordType = 'password';
                }

                // Listen event verify 2 step
                $scope.$on(AUTH_EVENTS.verify2Step, function(event, args){
                    console.log('Verify 2 step')
                    $scope.verifyG2fa = args.user ? true : false;
                    _userInfo = args.user
                });

                // Verify two step
                $scope.verify = function () {
                    if ($scope.verifyForm.$valid && _userInfo) {
                        $scope.processing = true;
                        Auth.login({
                                user_id: _userInfo.user_id,
                                code: $scope.verifyCode,
                                trust: $scope.trustDevice,
                                token: _userInfo.token
                            },
                            function (data) {
                                // Verify success
                                $scope.processing = false;

                                // Goto default page
                                gotoPage();

                            },
                            function () {
                                $scope.processing = false;
                                $scope.error = true;
                                $scope.showValidate = false;
                                $scope.verifyCode = ''; // Reset code
                            }
                        );
                    }else{
                        $scope.error = false;
                        $scope.showValidate = true;
                    }
                }
            }]
    );
});